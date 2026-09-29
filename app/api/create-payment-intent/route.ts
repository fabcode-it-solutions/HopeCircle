import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, campaignId, donorInfo, isRecurring, frequency } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify campaign exists
    const { data: campaign } = await supabase.from("campaigns").select("*").eq("id", campaignId).single()

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Create payment intent for one-time donation
    if (!isRecurring) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          campaignId,
          donorName: donorInfo.name,
          donorEmail: donorInfo.email,
          isAnonymous: donorInfo.isAnonymous.toString(),
          message: donorInfo.message || "",
        },
      })

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      })
    }

    // Create subscription for recurring donation
    const customer = await stripe.customers.create({
      email: donorInfo.email,
      name: donorInfo.name,
      metadata: {
        campaignId,
      },
    })

    // Determine price interval
    const interval = frequency === "yearly" ? "year" : frequency === "quarterly" ? "month" : "month"
    const intervalCount = frequency === "quarterly" ? 3 : 1

    // Create price
    const price = await stripe.prices.create({
      unit_amount: Math.round(amount * 100),
      currency: "usd",
      recurring: {
        interval,
        interval_count: intervalCount,
      },
      product_data: {
        name: `Recurring donation to ${campaign.title}`,
      },
    })

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        campaignId,
        donorName: donorInfo.name,
        donorEmail: donorInfo.email,
      },
    })

    const invoice = subscription.latest_invoice as Stripe.Invoice
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("[v0] Payment intent creation error:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
