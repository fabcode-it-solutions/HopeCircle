import type { Campaign } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import Image from "next/image"

interface CampaignHeaderProps {
  campaign: Campaign
}

export function CampaignHeader({ campaign }: CampaignHeaderProps) {
  return (
    <div className="border-b bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {campaign.organization_logo && (
              <div className="relative h-12 w-12 overflow-hidden rounded-full border bg-card">
                <Image
                  src={campaign.organization_logo || "/placeholder.svg"}
                  alt={campaign.organization_name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Created by</p>
              <p className="font-semibold text-foreground">{campaign.organization_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {campaign.status}
            </Badge>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">{campaign.title}</h1>
      </div>
    </div>
  )
}
