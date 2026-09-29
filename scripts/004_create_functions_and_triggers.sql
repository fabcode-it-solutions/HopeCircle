-- Function to update campaign current_amount when donations are added
create or replace function update_campaign_amount()
returns trigger as $$
begin
  if NEW.payment_status = 'completed' then
    update public.campaigns
    set current_amount = current_amount + NEW.amount,
        updated_at = now()
    where id = NEW.campaign_id;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger to automatically update campaign amount
drop trigger if exists update_campaign_amount_trigger on public.donations;
create trigger update_campaign_amount_trigger
  after insert or update of payment_status on public.donations
  for each row
  execute function update_campaign_amount();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

-- Add updated_at triggers to all tables
drop trigger if exists update_campaigns_updated_at on public.campaigns;
create trigger update_campaigns_updated_at
  before update on public.campaigns
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_donations_updated_at on public.donations;
create trigger update_donations_updated_at
  before update on public.donations
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_subscriptions_updated_at on public.recurring_subscriptions;
create trigger update_subscriptions_updated_at
  before update on public.recurring_subscriptions
  for each row
  execute function update_updated_at_column();
