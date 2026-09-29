export interface Campaign {
  id: string
  title: string
  slug: string
  description: string | null
  goal_amount: number
  current_amount: number
  currency: string
  image_url: string | null
  organization_name: string
  organization_logo: string | null
  status: "active" | "paused" | "completed" | "archived"
  end_date: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface Donation {
  id: string
  campaign_id: string
  donor_name: string | null
  donor_email: string | null
  donor_id: string | null
  amount: number
  currency: string
  payment_method: "stripe" | "paypal" | "square"
  payment_status: "pending" | "completed" | "failed" | "refunded"
  payment_intent_id: string | null
  is_recurring: boolean
  recurring_frequency: "monthly" | "quarterly" | "yearly" | null
  is_anonymous: boolean
  message: string | null
  tip_amount: number
  source: "web" | "kiosk"
  created_at: string
  updated_at: string
}

export interface RecurringSubscription {
  id: string
  campaign_id: string
  donor_id: string | null
  donor_email: string
  amount: number
  currency: string
  frequency: "monthly" | "quarterly" | "yearly"
  payment_method: "stripe" | "paypal" | "square"
  subscription_id: string
  status: "active" | "paused" | "cancelled" | "expired"
  next_payment_date: string | null
  last_payment_date: string | null
  created_at: string
  updated_at: string
}
