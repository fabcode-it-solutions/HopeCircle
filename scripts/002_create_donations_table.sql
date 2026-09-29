-- Create donations table to store all donation transactions
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  donor_name text,
  donor_email text,
  donor_id uuid references auth.users(id) on delete set null,
  amount decimal(12, 2) not null,
  currency text default 'USD',
  payment_method text not null check (payment_method in ('stripe', 'paypal', 'square')),
  payment_status text default 'pending' check (payment_status in ('pending', 'completed', 'failed', 'refunded')),
  payment_intent_id text,
  is_recurring boolean default false,
  recurring_frequency text check (recurring_frequency in ('monthly', 'quarterly', 'yearly')),
  is_anonymous boolean default false,
  message text,
  tip_amount decimal(12, 2) default 0,
  source text default 'web' check (source in ('web', 'kiosk')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.donations enable row level security;

-- Public can view non-anonymous donations
create policy "donations_select_public"
  on public.donations for select
  using (is_anonymous = false);

-- Authenticated users can view their own donations
create policy "donations_select_own"
  on public.donations for select
  using (auth.uid() = donor_id);

-- Anyone can insert donations (for anonymous donations)
create policy "donations_insert_public"
  on public.donations for insert
  with check (true);

-- Campaign owners can view all donations for their campaigns
create policy "donations_select_campaign_owner"
  on public.donations for select
  using (
    exists (
      select 1 from public.campaigns
      where campaigns.id = donations.campaign_id
      and campaigns.created_by = auth.uid()
    )
  );

-- Create indexes for performance
create index donations_campaign_id_idx on public.donations(campaign_id);
create index donations_donor_id_idx on public.donations(donor_id);
create index donations_payment_status_idx on public.donations(payment_status);
create index donations_created_at_idx on public.donations(created_at desc);
