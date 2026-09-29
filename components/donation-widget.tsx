"use client"

import type { Campaign } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Shield, Lock, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface DonationWidgetProps {
  campaign: Campaign
}

export function DonationWidget({ campaign }: DonationWidgetProps) {
  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          Support This Campaign
        </CardTitle>
        <p className="text-sm text-muted-foreground">Your donation will directly help {campaign.organization_name}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 rounded-lg bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium">Verified Campaign</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Lock className="h-4 w-4 text-primary" />
            <span className="font-medium">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="font-medium">100% Transparent</span>
          </div>
        </div>

        <Button size="lg" className="w-full h-12 text-lg" asChild>
          <Link href={`/donate/${campaign.slug}`}>
            <Heart className="h-5 w-5 mr-2" />
            Donate Now
          </Link>
        </Button>

        <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
          <p className="text-xs font-medium text-muted-foreground text-center">SECURE PAYMENT POWERED BY</p>
          <div className="flex items-center justify-center gap-4 text-sm font-semibold text-foreground">
            <span>Stripe</span>
            <span className="text-muted-foreground">•</span>
            <span>PayPal</span>
            <span className="text-muted-foreground">•</span>
            <span>Square</span>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Tax-deductible donations • Instant receipt • Cancel anytime
        </p>
      </CardContent>
    </Card>
  )
}
