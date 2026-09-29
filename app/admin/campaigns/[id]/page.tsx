import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Users, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"
import { DonationsList } from "@/components/donations-list"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignDetailsPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch campaign
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("created_by", user.id)
    .single()

  if (!campaign) {
    notFound()
  }

  // Fetch donations
  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .eq("campaign_id", id)
    .order("created_at", { ascending: false })

  const completedDonations = donations?.filter((d) => d.payment_status === "completed") || []
  const totalDonations = completedDonations.length
  const averageDonation = totalDonations > 0 ? Number(campaign.current_amount) / totalDonations : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm text-foreground">Campaign Details</span>
              </div>
              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">{campaign.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {campaign.status}
              </Badge>
              <Button variant="outline" asChild>
                <Link href={`/campaign/${campaign.slug}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Public Page
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${Number(campaign.current_amount).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {((Number(campaign.current_amount) / Number(campaign.goal_amount)) * 100).toFixed(1)}% of goal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalDonations}</div>
              <p className="text-xs text-muted-foreground">unique donations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Donation</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${averageDonation.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">per donation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Days Remaining</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {campaign.end_date
                  ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : "∞"}
              </div>
              <p className="text-xs text-muted-foreground">until end date</p>
            </CardContent>
          </Card>
        </div>

        {/* Donations List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <DonationsList donations={donations || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
