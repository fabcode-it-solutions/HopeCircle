import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, TrendingUp, Users } from "lucide-react"

interface CampaignProgressProps {
  currentAmount: number
  goalAmount: number
  currency: string
  supportersCount: number
  daysRemaining: number | null
}

export function CampaignProgress({
  currentAmount,
  goalAmount,
  currency,
  supportersCount,
  daysRemaining,
}: CampaignProgressProps) {
  const percentageRaised = Math.min(100, (currentAmount / goalAmount) * 100)

  return (
    <Card className="shadow-md">
      <CardContent className="p-6 md:p-8">
        <div className="mb-6">
          <div className="mb-3 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold text-foreground md:text-5xl">${currentAmount.toLocaleString()}</span>
            <span className="text-lg text-muted-foreground">raised of ${goalAmount.toLocaleString()} goal</span>
          </div>
          <Progress value={percentageRaised} className="h-3 md:h-4" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-4 transition-all hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{percentageRaised.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground font-medium">Funded</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border bg-gradient-to-br from-accent/5 to-accent/10 p-4 transition-all hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{supportersCount}</div>
              <div className="text-xs text-muted-foreground font-medium">Supporters</div>
            </div>
          </div>

          {daysRemaining !== null && (
            <div className="flex items-center gap-3 rounded-xl border bg-gradient-to-br from-muted to-muted/50 p-4 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                <Calendar className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{daysRemaining}</div>
                <div className="text-xs text-muted-foreground font-medium">Days Left</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
