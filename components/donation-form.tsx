"use client"

import { useState } from "react"
import type { Campaign } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, DollarSign, Heart, Repeat } from "lucide-react"
import { cn } from "@/lib/utils"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useRouter } from "next/navigation"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface DonationFormProps {
  campaign: Campaign
}

const PRESET_AMOUNTS = [5, 25, 50, 100, 250, 500]

function DonationFormContent({ campaign }: DonationFormProps) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()

  const [step, setStep] = useState<"amount" | "details" | "payment">("amount")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [frequency, setFrequency] = useState<"monthly" | "quarterly" | "yearly">("monthly")
  const [coverFees, setCoverFees] = useState(false)
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    isAnonymous: false,
    message: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "square">("stripe")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const amount = customAmount ? Number.parseFloat(customAmount) : selectedAmount || 0
  const feeAmount = coverFees ? amount * 0.029 + 0.3 : 0
  const totalAmount = amount + feeAmount

  const handleAmountSelect = (value: number) => {
    setSelectedAmount(value)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const handleContinueToDetails = () => {
    if (amount > 0) {
      setStep("details")
    }
  }

  const handleContinueToPayment = async () => {
    if (donorInfo.name && donorInfo.email) {
      setStep("payment")

      // Create payment intent for Stripe
      if (paymentMethod === "stripe") {
        try {
          const response = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: totalAmount,
              campaignId: campaign.id,
              donorInfo,
              isRecurring,
              frequency: isRecurring ? frequency : null,
            }),
          })

          const data = await response.json()
          setClientSecret(data.clientSecret)
        } catch (error) {
          console.error("[v0] Failed to create payment intent:", error)
        }
      }
    }
  }

  const handleStripeSubmit = async () => {
    if (!stripe || !elements) return

    setIsProcessing(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donation-success?campaign=${campaign.slug}`,
        },
      })

      if (error) {
        console.error("[v0] Payment error:", error)
        alert(error.message)
      }
    } catch (error) {
      console.error("[v0] Payment submission error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayPalSubmit = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch("/api/create-paypal-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          campaignId: campaign.id,
          donorInfo,
        }),
      })

      const data = await response.json()

      // Redirect to PayPal for approval
      window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.orderId}`
    } catch (error) {
      console.error("[v0] PayPal error:", error)
      setIsProcessing(false)
    }
  }

  const handleSquareSubmit = async () => {
    setIsProcessing(true)

    try {
      // Square Web Payments SDK integration would go here
      alert("Square integration requires the Square Web Payments SDK. Please add your Square Application ID.")
    } catch (error) {
      console.error("[v0] Square error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async () => {
    if (paymentMethod === "stripe") {
      await handleStripeSubmit()
    } else if (paymentMethod === "paypal") {
      await handlePayPalSubmit()
    } else if (paymentMethod === "square") {
      await handleSquareSubmit()
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors",
            step === "amount"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted bg-card text-muted-foreground",
          )}
        >
          1
        </div>
        <div className={cn("h-1 w-16 rounded", step !== "amount" ? "bg-primary" : "bg-muted")} />
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors",
            step === "details"
              ? "border-primary bg-primary text-primary-foreground"
              : step === "payment"
                ? "border-primary bg-card text-primary"
                : "border-muted bg-card text-muted-foreground",
          )}
        >
          2
        </div>
        <div className={cn("h-1 w-16 rounded", step === "payment" ? "bg-primary" : "bg-muted")} />
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors",
            step === "payment"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted bg-card text-muted-foreground",
          )}
        >
          3
        </div>
      </div>

      {/* Step 1: Amount Selection */}
      {step === "amount" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Choose Your Donation Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preset Amounts */}
            <div className="grid grid-cols-3 gap-3">
              {PRESET_AMOUNTS.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={selectedAmount === preset ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleAmountSelect(preset)}
                  className="text-lg font-semibold"
                >
                  ${preset}
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="custom-amount">Or enter a custom amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="pl-7 text-lg"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>

            {/* Recurring Option */}
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Repeat className="h-5 w-5 text-primary" />
                  <Label htmlFor="recurring" className="cursor-pointer font-semibold">
                    Make this a recurring donation
                  </Label>
                </div>
                <Checkbox
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                />
              </div>

              {isRecurring && (
                <RadioGroup value={frequency} onValueChange={(value) => setFrequency(value as typeof frequency)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer">
                      Monthly
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quarterly" id="quarterly" />
                    <Label htmlFor="quarterly" className="cursor-pointer">
                      Quarterly
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly" className="cursor-pointer">
                      Yearly
                    </Label>
                  </div>
                </RadioGroup>
              )}
            </div>

            {/* Cover Fees */}
            <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
              <Checkbox
                id="cover-fees"
                checked={coverFees}
                onCheckedChange={(checked) => setCoverFees(checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="cover-fees" className="cursor-pointer font-semibold">
                  Cover transaction fees (${feeAmount.toFixed(2)})
                </Label>
                <p className="text-sm text-muted-foreground">
                  100% of your donation goes to {campaign.organization_name}
                </p>
              </div>
            </div>

            {/* Total */}
            {amount > 0 && (
              <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">Total Amount</span>
                  <span className="text-3xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            <Button size="lg" className="w-full" onClick={handleContinueToDetails} disabled={amount <= 0}>
              Continue to Details
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Donor Details */}
      {step === "details" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={donorInfo.name}
                onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={donorInfo.email}
                onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Share why you're supporting this cause..."
                value={donorInfo.message}
                onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-4">
              <Checkbox
                id="anonymous"
                checked={donorInfo.isAnonymous}
                onCheckedChange={(checked) => setDonorInfo({ ...donorInfo, isAnonymous: checked as boolean })}
              />
              <Label htmlFor="anonymous" className="cursor-pointer">
                Make my donation anonymous
              </Label>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("amount")}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleContinueToPayment}
                disabled={!donorInfo.name || !donorInfo.email}
              >
                Continue to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Payment Method */}
      {step === "payment" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Choose Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}
            >
              <div
                className={cn(
                  "flex items-center gap-4 rounded-lg border-2 p-4 transition-colors",
                  paymentMethod === "stripe" ? "border-primary bg-primary/5" : "border-border",
                )}
              >
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex flex-1 cursor-pointer items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Credit/Debit Card</p>
                    <p className="text-sm text-muted-foreground">Powered by Stripe</p>
                  </div>
                </Label>
              </div>

              <div
                className={cn(
                  "flex items-center gap-4 rounded-lg border-2 p-4 transition-colors",
                  paymentMethod === "paypal" ? "border-primary bg-primary/5" : "border-border",
                )}
              >
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex flex-1 cursor-pointer items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">PayPal</p>
                    <p className="text-sm text-muted-foreground">Fast and secure</p>
                  </div>
                </Label>
              </div>

              <div
                className={cn(
                  "flex items-center gap-4 rounded-lg border-2 p-4 transition-colors",
                  paymentMethod === "square" ? "border-primary bg-primary/5" : "border-border",
                )}
              >
                <RadioGroupItem value="square" id="square" />
                <Label htmlFor="square" className="flex flex-1 cursor-pointer items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Square</p>
                    <p className="text-sm text-muted-foreground">Secure checkout</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {/* Stripe Payment Element */}
            {paymentMethod === "stripe" && clientSecret && <PaymentElement />}

            {/* Summary */}
            <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold">Donation Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Donation Amount</span>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </div>
                {coverFees && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Fees</span>
                    <span className="font-medium">${feeAmount.toFixed(2)}</span>
                  </div>
                )}
                {isRecurring && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency</span>
                    <span className="font-medium capitalize">{frequency}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button size="lg" className="flex-1" onClick={handleSubmit} disabled={isProcessing || !stripe}>
                {isProcessing ? "Processing..." : "Complete Donation"}
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Your payment information is secure and encrypted. We never store your card details.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function DonationForm({ campaign }: DonationFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <DonationFormContent campaign={campaign} />
    </Elements>
  )
}
