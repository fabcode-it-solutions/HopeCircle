-- Create campaigns table to store fundraising campaigns
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  goal_amount decimal(12, 2) not null,
  current_amount decimal(12, 2) default 0,
  currency text default 'USD',
  image_url text,
  organization_name text not null,
  organization_logo text,
  status text default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  end_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Enable RLS
alter table public.campaigns enable row level security;

-- Public can view active campaigns
create policy "campaigns_select_public"
  on public.campaigns for select
  using (status = 'active');

-- Authenticated users can create campaigns
create policy "campaigns_insert_auth"
  on public.campaigns for insert
  to authenticated
  with check (auth.uid() = created_by);

-- Users can update their own campaigns
create policy "campaigns_update_own"
  on public.campaigns for update
  using (auth.uid() = created_by);

-- Users can delete their own campaigns
create policy "campaigns_delete_own"
  on public.campaigns for delete
  using (auth.uid() = created_by);

-- Create index for slug lookups
create index campaigns_slug_idx on public.campaigns(slug);

-- Create index for status filtering
create index campaigns_status_idx on public.campaigns(status);
