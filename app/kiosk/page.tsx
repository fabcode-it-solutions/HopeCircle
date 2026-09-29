import { createClient } from "@/lib/supabase/server"
import { KioskCampaignSelector } from "@/components/kiosk-campaign-selector"

export default async function KioskModePage() {
  const supabase = await createClient()

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <KioskCampaignSelector campaigns={campaigns || []} />
    </div>
  )
}
