import type { Donation } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface DonationsListProps {
  donations: Donation[]
}

export function DonationsList({ donations }: DonationsListProps) {
  if (donations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No donations yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {donations.map((donation) => (
        <div key={donation.id} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <p className="font-semibold text-foreground">
                {donation.is_anonymous ? "Anonymous" : donation.donor_name || "Unknown"}
              </p>
              <Badge variant={donation.payment_status === "completed" ? "default" : "secondary"} className="capitalize">
                {donation.payment_status}
              </Badge>
              {donation.is_recurring && <Badge variant="outline">Recurring</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">
              {donation.donor_email} • {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
            </p>
            {donation.message && <p className="mt-2 text-sm italic text-muted-foreground">{donation.message}</p>}
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">${Number(donation.amount).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground capitalize">{donation.payment_method}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
