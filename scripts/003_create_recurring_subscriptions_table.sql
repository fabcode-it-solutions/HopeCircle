-- Create recurring subscriptions table for managing recurring donations
create table if not exists public.recurring_subscriptions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  donor_id uuid references auth.users(id) on delete set null,
  donor_email text not null,
  amount decimal(12, 2) not null,
  currency text default 'USD',
  frequency text not null check (frequency in ('monthly', 'quarterly', 'yearly')),
  payment_method text not null check (payment_method in ('stripe', 'paypal', 'square')),
  subscription_id text not null,
  status text default 'active' check (status in ('active', 'paused', 'cancelled', 'expired')),
  next_payment_date timestamp with time zone,
  last_payment_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.recurring_subscriptions enable row level security;

-- Users can view their own subscriptions
create policy "subscriptions_select_own"
  on public.recurring_subscriptions for select
  using (auth.uid() = donor_id);

-- Anyone can create subscriptions
create policy "subscriptions_insert_public"
  on public.recurring_subscriptions for insert
  with check (true);

-- Users can update their own subscriptions
create policy "subscriptions_update_own"
  on public.recurring_subscriptions for update
  using (auth.uid() = donor_id);

-- Campaign owners can view subscriptions for their campaigns
create policy "subscriptions_select_campaign_owner"
  on public.recurring_subscriptions for select
  using (
    exists (
      select 1 from public.campaigns
      where campaigns.id = recurring_subscriptions.campaign_id
      and campaigns.created_by = auth.uid()
    )
  );

-- Create indexes
create index subscriptions_campaign_id_idx on public.recurring_subscriptions(campaign_id);
create index subscriptions_donor_id_idx on public.recurring_subscriptions(donor_id);
create index subscriptions_status_idx on public.recurring_subscriptions(status);
