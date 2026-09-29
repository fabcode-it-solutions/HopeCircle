import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { KioskDonationFlow } from "@/components/kiosk-donation-flow"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function KioskCampaignPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: campaign } = await supabase.from("campaigns").select("*").eq("slug", slug).single()

  if (!campaign) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <KioskDonationFlow campaign={campaign} />
    </div>
  )
}
