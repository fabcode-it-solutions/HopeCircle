import { type NextRequest, NextResponse } from "next/server"
import { SquareClient, SquareEnvironment } from "square"
import { createClient } from "@/lib/supabase/server"
import { randomUUID } from "crypto"

export const runtime = 'nodejs' // Force Node.js runtime

if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error('SQUARE_ACCESS_TOKEN is required')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, campaignId, donorInfo, sourceId } = body

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
    }

    if (!sourceId) {
      return NextResponse.json({ error: "Source ID is required" }, { status: 400 })
    }

    if (!donorInfo || !donorInfo.name || !donorInfo.email) {
      return NextResponse.json({ error: "Donor information is required" }, { status: 400 })
    }

    // Initialize Square client inside the function
    const squareClient = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN || '',
      environment: process.env.NODE_ENV === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox
    })

    const supabase = await createClient()

    // Verify campaign exists
    const { data: campaign } = await supabase.from("campaigns").select("*").eq("id", campaignId).single()

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Create payment
    const response = await squareClient.payments.create({
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(Math.round(amount * 100)),
        currency: "USD",
      },
      note: `Donation to ${campaign.title}`,
    })

    if (response.payment?.status === "COMPLETED") {
      // Create donation record
      const { error: insertError } = await supabase.from("donations").insert({
        campaign_id: campaignId,
        donor_name: donorInfo.name,
        donor_email: donorInfo.email,
        amount,
        currency: "USD",
        payment_method: "square",
        payment_status: "completed",
        payment_intent_id: response.payment.id,
        is_anonymous: donorInfo.isAnonymous || false,
        message: donorInfo.message || null,
        source: "web",
      })

      if (insertError) {
        console.error("[Square] Database insert error:", insertError)
        return NextResponse.json({ error: "Failed to save donation record" }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        payment: response.payment,
        donationId: response.payment.id 
      })
    }

    return NextResponse.json({ 
      error: "Payment not completed", 
      paymentStatus: response.payment?.status 
    }, { status: 400 })
  } catch (error) {
    console.error("[Square] Payment error:", error)
    
    // Handle specific Square API errors
    if (error instanceof Error) {
      if (error.message.includes('INVALID_REQUEST_ERROR')) {
        return NextResponse.json({ error: "Invalid payment request" }, { status: 400 })
      }
      if (error.message.includes('CARD_DECLINED')) {
        return NextResponse.json({ error: "Payment was declined" }, { status: 402 })
      }
      if (error.message.includes('INSUFFICIENT_FUNDS')) {
        return NextResponse.json({ error: "Insufficient funds" }, { status: 402 })
      }
    }
    
    return NextResponse.json({ 
      error: "Failed to process Square payment",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}
