import { Shield, Lock, Award, CheckCircle2 } from "lucide-react"

export function TrustBadges() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold text-sm">Secure Payments</div>
          <div className="text-xs text-muted-foreground">256-bit SSL encryption</div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold text-sm">Data Protected</div>
          <div className="text-xs text-muted-foreground">PCI DSS compliant</div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Award className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold text-sm">Verified Campaigns</div>
          <div className="text-xs text-muted-foreground">100% transparency</div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold text-sm">Trusted Platform</div>
          <div className="text-xs text-muted-foreground">15K+ happy donors</div>
        </div>
      </div>
    </div>
  )
}
