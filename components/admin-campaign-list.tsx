import type { Campaign } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Eye } from "lucide-react"
import Link from "next/link"

interface AdminCampaignListProps {
  campaigns: Campaign[]
}

export function AdminCampaignList({ campaigns }: AdminCampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="mb-4 text-muted-foreground">You haven&apos;t created any campaigns yet.</p>
        <Button asChild>
          <Link href="/admin/campaigns/new">Create Your First Campaign</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => {
        const percentageRaised = Math.min(100, (Number(campaign.current_amount) / Number(campaign.goal_amount)) * 100)

        return (
          <div key={campaign.id} className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{campaign.title}</h3>
                <Badge variant="secondary" className="capitalize">
                  {campaign.status}
                </Badge>
              </div>
              <div className="mb-2 space-y-1">
                <div className="flex items-baseline gap-2 text-sm">
                  <span className="font-semibold text-foreground">
                    ${Number(campaign.current_amount).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">of ${Number(campaign.goal_amount).toLocaleString()}</span>
                </div>
                <Progress value={percentageRaised} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">{percentageRaised.toFixed(1)}% funded</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/campaigns/${campaign.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
          </div>
        )
      })}
    </div>
  )
}
