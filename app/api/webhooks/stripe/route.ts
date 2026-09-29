import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error("[v0] Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const metadata = paymentIntent.metadata

        // Create donation record
        await supabase.from("donations").insert({
          campaign_id: metadata.campaignId,
          donor_name: metadata.donorName,
          donor_email: metadata.donorEmail,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          payment_method: "stripe",
          payment_status: "completed",
          payment_intent_id: paymentIntent.id,
          is_anonymous: metadata.isAnonymous === "true",
          message: metadata.message || null,
          source: "web",
        })

        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
        const metadata = subscription.metadata

        // Create donation record for recurring payment
        await supabase.from("donations").insert({
          campaign_id: metadata.campaignId,
          donor_name: metadata.donorName,
          donor_email: metadata.donorEmail,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency.toUpperCase(),
          payment_method: "stripe",
          payment_status: "completed",
          payment_intent_id: invoice.payment_intent as string,
          is_recurring: true,
          source: "web",
        })

        // Update or create recurring subscription record
        const { data: existingSubscription } = await supabase
          .from("recurring_subscriptions")
          .select("*")
          .eq("subscription_id", subscription.id)
          .single()

        if (!existingSubscription) {
          await supabase.from("recurring_subscriptions").insert({
            campaign_id: metadata.campaignId,
            donor_email: metadata.donorEmail,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency.toUpperCase(),
            frequency: subscription.items.data[0].price.recurring?.interval === "year" ? "yearly" : "monthly",
            payment_method: "stripe",
            subscription_id: subscription.id,
            status: "active",
            next_payment_date: new Date(subscription.current_period_end * 1000).toISOString(),
            last_payment_date: new Date().toISOString(),
          })
        } else {
          await supabase
            .from("recurring_subscriptions")
            .update({
              last_payment_date: new Date().toISOString(),
              next_payment_date: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq("subscription_id", subscription.id)
        }

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        // Update subscription status to cancelled
        await supabase
          .from("recurring_subscriptions")
          .update({ status: "cancelled" })
          .eq("subscription_id", subscription.id)

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
