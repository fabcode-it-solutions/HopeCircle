import { createClient } from "@/lib/supabase/server"
import type { Campaign, Donation } from "@/lib/types"
import { notFound } from "next/navigation"
import { CampaignProgress } from "@/components/campaign-progress"
import { CampaignAbout } from "@/components/campaign-about"
import { RecentDonations } from "@/components/recent-donations"
import { DonationWidget } from "@/components/donation-widget"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2, ArrowLeft, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CampaignPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch campaign
  const { data: campaign } = await supabase.from("campaigns").select("*").eq("slug", slug).single()

  if (!campaign) {
    notFound()
  }

  // Fetch recent donations
  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .eq("campaign_id", campaign.id)
    .eq("payment_status", "completed")
    .order("created_at", { ascending: false })
    .limit(10)

  // Count total supporters
  const { count: supportersCount } = await supabase
    .from("donations")
    .select("*", { count: "exact", head: true })
    .eq("campaign_id", campaign.id)
    .eq("payment_status", "completed")

  // Calculate days remaining
  const daysRemaining = campaign.end_date
    ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <div className="min-h-screen bg-background">
      <div className="relative border-b">
        {/* Hero Image */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-muted">
          <Image
            src={
              campaign.image_url ||
              `/placeholder.svg?height=500&width=1200&query=${encodeURIComponent(campaign.title + " campaign charity")}`
            }
            alt={campaign.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Button variant="secondary" size="sm" asChild className="gap-2 backdrop-blur-sm bg-background/80">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Campaigns
              </Link>
            </Button>
          </div>

          {/* Share Button */}
          <div className="absolute top-4 right-4">
            <Button variant="secondary" size="sm" className="gap-2 backdrop-blur-sm bg-background/80">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Campaign Info Overlay */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-32 pb-8">
            <div className="rounded-xl border bg-card p-6 shadow-xl md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {campaign.organization_logo && (
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-background bg-card shadow-md">
                    <Image
                      src={campaign.organization_logo || "/placeholder.svg"}
                      alt={campaign.organization_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Created by</p>
                  <p className="font-semibold text-foreground text-lg">{campaign.organization_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {campaign.status}
                  </Badge>
                </div>
              </div>

              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                {campaign.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <CampaignProgress
              currentAmount={campaign.current_amount}
              goalAmount={campaign.goal_amount}
              currency={campaign.currency}
              supportersCount={supportersCount || 0}
              daysRemaining={daysRemaining}
            />

            <CampaignAbout
              description={campaign.description || ""}
              organizationName={campaign.organization_name}
              organizationLogo={campaign.organization_logo}
            />

            <RecentDonations donations={(donations as Donation[]) || []} />
          </div>

          {/* Sidebar - Donation Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <DonationWidget campaign={campaign as Campaign} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
