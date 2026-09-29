import type { Campaign } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const percentageRaised = Math.min(100, (campaign.current_amount / campaign.goal_amount) * 100)
  const daysRemaining = campaign.end_date
    ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl hover:border-primary/50">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={
            campaign.image_url ||
            `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(campaign.title + " campaign charity donation")}`
          }
          alt={campaign.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
          ✓ Verified
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {campaign.organization_name}
          </span>
        </div>

        <h3 className="mb-3 line-clamp-2 text-balance text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {campaign.title}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-foreground">${campaign.current_amount.toLocaleString()}</span>
              <span className="ml-2 text-sm text-muted-foreground">of ${campaign.goal_amount.toLocaleString()}</span>
            </div>
          </div>

          <Progress value={percentageRaised} className="h-2.5" />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">{percentageRaised.toFixed(0)}% funded</span>
            </div>
            {daysRemaining !== null && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{daysRemaining} days left</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Link href={`/campaign/${campaign.slug}`}>Donate Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
