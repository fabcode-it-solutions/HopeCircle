import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CampaignForm } from "@/components/campaign-form"

export default async function NewCampaignPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Campaign</h1>
          <p className="text-muted-foreground">Set up a new fundraising campaign</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <CampaignForm userId={user.id} />
        </div>
      </div>
    </div>
  )
}
