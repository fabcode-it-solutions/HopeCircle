import type { Donation } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface RecentDonationsProps {
  donations: Donation[]
}

export function RecentDonations({ donations }: RecentDonationsProps) {
  if (!donations || donations.length === 0) {
    return null
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Heart className="h-5 w-5 text-primary" />
          Recent Donations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {donations.map((donation) => {
            const initials = donation.is_anonymous
              ? "?"
              : donation.donor_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "?"

            return (
              <div
                key={donation.id}
                className="flex items-start gap-4 rounded-xl border bg-gradient-to-br from-card to-muted/30 p-4 transition-all hover:shadow-md"
              >
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-foreground truncate">
                      {donation.is_anonymous ? "Anonymous Donor" : donation.donor_name}
                    </p>
                    <span className="text-sm font-bold text-primary shrink-0">${donation.amount.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
                  </p>
                  {donation.message && (
                    <p className="mt-2 text-sm italic text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-3">
                      "{donation.message}"
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
