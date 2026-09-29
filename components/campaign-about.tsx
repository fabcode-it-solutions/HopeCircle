import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Shield } from "lucide-react"
import Image from "next/image"

interface CampaignAboutProps {
  description: string
  organizationName: string
  organizationLogo: string | null
}

export function CampaignAbout({ description, organizationName, organizationLogo }: CampaignAboutProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">About this Campaign</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-sm max-w-none">
          <p className="text-pretty leading-relaxed text-foreground whitespace-pre-wrap">{description}</p>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-muted/50 to-muted/30 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Building2 className="h-3 w-3" />
              Organizer
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" />
              Verified
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            {organizationLogo && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-background bg-card shadow-md">
                <Image
                  src={organizationLogo || "/placeholder.svg"}
                  alt={organizationName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-semibold text-foreground text-lg">{organizationName}</p>
              <p className="text-sm text-muted-foreground">Campaign Organizer</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
