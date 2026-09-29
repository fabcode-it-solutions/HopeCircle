"use client"

import { useState } from "react"
import type { Campaign } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Check, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface KioskDonationFlowProps {
  campaign: Campaign
}

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500]

export function KioskDonationFlow({ campaign }: KioskDonationFlowProps) {
  const router = useRouter()
  const [step, setStep] = useState<"amount" | "payment" | "complete">("amount")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "square">("stripe")

  const amount = customAmount ? Number.parseFloat(customAmount) : selectedAmount || 0

  const handleAmountSelect = (value: number) => {
    setSelectedAmount(value)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const handleContinueToPayment = () => {
    if (amount > 0) {
      setStep("payment")
    }
  }

  const handleCompletePayment = async () => {
    // This will be implemented with actual payment gateway integration
    console.log("[v0] Kiosk donation:", {
      campaign: campaign.id,
      amount,
      paymentMethod,
      source: "kiosk",
    })

    setStep("complete")

    // Auto-return to campaign selector after 5 seconds
    setTimeout(() => {
      router.push("/kiosk")
    }, 5000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-b bg-card px-8 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={() => (step === "amount" ? router.push("/kiosk") : setStep("amount"))}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">{campaign.title}</h2>
            <p className="text-muted-foreground">{campaign.organization_name}</p>
          </div>
          <div className="w-32" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {/* Step 1: Amount Selection */}
          {step === "amount" && (
            <Card className="border-2">
              <CardContent className="p-12">
                <h3 className="mb-8 text-center text-4xl font-bold text-foreground">Choose Your Donation Amount</h3>

                {/* Preset Amounts */}
                <div className="mb-8 grid grid-cols-3 gap-6">
                  {PRESET_AMOUNTS.map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant={selectedAmount === preset ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleAmountSelect(preset)}
                      className="h-32 text-4xl font-bold"
                    >
                      ${preset}
                    </Button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-8">
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="h-24 pl-16 text-3xl"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Total Display */}
                {amount > 0 && (
                  <div className="mb-8 rounded-lg border-2 border-primary bg-primary/5 p-8 text-center">
                    <p className="mb-2 text-xl text-muted-foreground">Your Donation</p>
                    <p className="text-6xl font-bold text-primary">${amount.toFixed(2)}</p>
                  </div>
                )}

                <Button
                  size="lg"
                  className="h-20 w-full text-2xl"
                  onClick={handleContinueToPayment}
                  disabled={amount <= 0}
                >
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Payment Method */}
          {step === "payment" && (
            <Card className="border-2">
              <CardContent className="p-12">
                <h3 className="mb-8 text-center text-4xl font-bold text-foreground">Choose Payment Method</h3>

                <div className="mb-8 space-y-6">
                  <button
                    onClick={() => setPaymentMethod("stripe")}
                    className={cn(
                      "flex w-full items-center gap-6 rounded-lg border-4 p-8 transition-all",
                      paymentMethod === "stripe"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10">
                      <CreditCard className="h-10 w-10 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-2xl font-bold text-foreground">Credit/Debit Card</p>
                      <p className="text-lg text-muted-foreground">Powered by Stripe</p>
                    </div>
                    {paymentMethod === "stripe" && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                        <Check className="h-6 w-6 text-primary-foreground" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setPaymentMethod("paypal")}
                    className={cn(
                      "flex w-full items-center gap-6 rounded-lg border-4 p-8 transition-all",
                      paymentMethod === "paypal"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10">
                      <CreditCard className="h-10 w-10 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-2xl font-bold text-foreground">PayPal</p>
                      <p className="text-lg text-muted-foreground">Fast and secure</p>
                    </div>
                    {paymentMethod === "paypal" && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                        <Check className="h-6 w-6 text-primary-foreground" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setPaymentMethod("square")}
                    className={cn(
                      "flex w-full items-center gap-6 rounded-lg border-4 p-8 transition-all",
                      paymentMethod === "square"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10">
                      <CreditCard className="h-10 w-10 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-2xl font-bold text-foreground">Square</p>
                      <p className="text-lg text-muted-foreground">Secure checkout</p>
                    </div>
                    {paymentMethod === "square" && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                        <Check className="h-6 w-6 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                </div>

                <div className="mb-8 rounded-lg border bg-muted p-6 text-center">
                  <p className="mb-2 text-xl text-muted-foreground">Total Amount</p>
                  <p className="text-5xl font-bold text-primary">${amount.toFixed(2)}</p>
                </div>

                <Button size="lg" className="h-20 w-full text-2xl" onClick={handleCompletePayment}>
                  Complete Donation
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Success */}
          {step === "complete" && (
            <Card className="border-2 border-primary">
              <CardContent className="p-12 text-center">
                <div className="mb-8 flex justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary">
                    <Check className="h-16 w-16 text-primary-foreground" />
                  </div>
                </div>

                <h3 className="mb-4 text-5xl font-bold text-foreground">Thank You!</h3>
                <p className="mb-8 text-2xl text-muted-foreground">
                  Your donation of ${amount.toFixed(2)} has been received
                </p>

                <div className="rounded-lg bg-primary/5 p-8">
                  <p className="text-xl text-foreground">
                    Your generosity helps <span className="font-bold">{campaign.organization_name}</span> continue their
                    important work.
                  </p>
                </div>

                <p className="mt-8 text-lg text-muted-foreground">Returning to campaign selection in 5 seconds...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
