"use client"

import type { Campaign } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface KioskCampaignSelectorProps {
  campaigns: Campaign[]
}

export function KioskCampaignSelector({ campaigns }: KioskCampaignSelectorProps) {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-b bg-primary px-8 py-12 text-center">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-4">
          <Heart className="h-16 w-16 text-primary-foreground" />
          <div>
            <h1 className="text-5xl font-bold text-primary-foreground">Make a Difference</h1>
            <p className="mt-2 text-xl text-primary-foreground/90">Choose a campaign to support</p>
          </div>
        </div>
      </div>

      {/* Campaign Grid */}
      <div className="flex-1 p-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const percentageRaised = Math.min(100, (campaign.current_amount / campaign.goal_amount) * 100)

            return (
              <Card
                key={campaign.id}
                className="group cursor-pointer overflow-hidden transition-all hover:scale-105 hover:shadow-2xl"
                onClick={() => router.push(`/kiosk/${campaign.slug}`)}
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    src={campaign.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="mb-4 text-balance text-2xl font-bold text-foreground">{campaign.title}</h3>
                  <p className="mb-6 line-clamp-2 text-lg text-muted-foreground">{campaign.description}</p>

                  <div className="mb-6 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-bold text-primary">
                        ${campaign.current_amount.toLocaleString()}
                      </span>
                      <span className="text-lg text-muted-foreground">of ${campaign.goal_amount.toLocaleString()}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary transition-all" style={{ width: `${percentageRaised}%` }} />
                    </div>
                  </div>

                  <Button size="lg" className="w-full text-lg" onClick={() => router.push(`/kiosk/${campaign.slug}`)}>
                    Donate Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-muted px-8 py-6 text-center">
        <p className="text-lg text-muted-foreground">Touch any campaign to begin your donation</p>
      </div>
    </div>
  )
}
