import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    const accessToken = await getPayPalAccessToken()

    // Capture the order
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    const captureData = await response.json()

    if (captureData.status === "COMPLETED") {
      const customData = JSON.parse(captureData.purchase_units[0].payments.captures[0].custom_id)
      const amount = Number.parseFloat(captureData.purchase_units[0].payments.captures[0].amount.value)

      const supabase = await createClient()

      // Create donation record
      await supabase.from("donations").insert({
        campaign_id: customData.campaignId,
        donor_name: customData.donorName,
        donor_email: customData.donorEmail,
        amount,
        currency: "USD",
        payment_method: "paypal",
        payment_status: "completed",
        payment_intent_id: captureData.id,
        is_anonymous: customData.isAnonymous,
        message: customData.message || null,
        source: "web",
      })

      return NextResponse.json({ success: true, captureData })
    }

    return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
  } catch (error) {
    console.error("[v0] PayPal capture error:", error)
    return NextResponse.json({ error: "Failed to capture PayPal payment" }, { status: 500 })
  }
}
