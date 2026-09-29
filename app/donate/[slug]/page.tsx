import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { DonationForm } from "@/components/donation-form"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Lock, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DonatePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: campaign } = await supabase.from("campaigns").select("*").eq("slug", slug).single()

  if (!campaign) {
    notFound()
  }

  const percentageRaised = Math.min(100, (campaign.current_amount / campaign.goal_amount) * 100)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <span className="font-medium">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="font-medium">Instant Receipt</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href={`/campaign/${campaign.slug}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Campaign
            </Link>
          </Button>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Support {campaign.title}
            </h1>
            <p className="mt-2 text-muted-foreground text-lg">Choose your donation amount and payment method</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Donation Form */}
            <div className="lg:col-span-2">
              <DonationForm campaign={campaign} />
            </div>

            {/* Campaign Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20 shadow-lg">
                <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
                  <Image
                    src={
                      campaign.image_url ||
                      `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(campaign.title + " campaign")}`
                    }
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
                    ✓ Verified
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {campaign.organization_name}
                    </Badge>
                  </div>

                  <h3 className="mb-4 text-balance text-lg font-semibold text-foreground leading-snug">
                    {campaign.title}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="mb-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-foreground">
                          ${campaign.current_amount.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          of ${campaign.goal_amount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={percentageRaised} className="h-2.5" />
                    </div>

                    <p className="text-sm font-medium text-muted-foreground">{percentageRaised.toFixed(0)}% funded</p>
                  </div>

                  <div className="mt-6 space-y-2 rounded-lg border bg-muted/50 p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Your donation is protected
                    </p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Secure payment processing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Tax-deductible receipt</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Cancel recurring anytime</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
