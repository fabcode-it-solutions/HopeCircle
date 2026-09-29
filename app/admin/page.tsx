import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Users, Heart, Plus } from "lucide-react"
import Link from "next/link"
import { AdminCampaignList } from "@/components/admin-campaign-list"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's campaigns
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })

  // Calculate total stats
  const totalRaised = campaigns?.reduce((sum, c) => sum + Number(c.current_amount), 0) || 0
  const totalGoal = campaigns?.reduce((sum, c) => sum + Number(c.goal_amount), 0) || 0
  const activeCampaigns = campaigns?.filter((c) => c.status === "active").length || 0

  // Fetch total donations count for user's campaigns
  const campaignIds = campaigns?.map((c) => c.id) || []
  const { count: totalDonations } = await supabase
    .from("donations")
    .select("*", { count: "exact", head: true })
    .in("campaign_id", campaignIds)
    .eq("payment_status", "completed")

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your campaigns and track donations</p>
            </div>
            <Button asChild>
              <Link href="/admin/campaigns/new">
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalRaised.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">of ${totalGoal.toLocaleString()} goal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">of {campaigns?.length || 0} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalDonations || 0}</div>
              <p className="text-xs text-muted-foreground">across all campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Donation</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${totalDonations ? (totalRaised / totalDonations).toFixed(2) : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">per donation</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminCampaignList campaigns={campaigns || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
