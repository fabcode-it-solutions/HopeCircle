-- Insert sample campaigns for demonstration
insert into public.campaigns (title, slug, description, goal_amount, current_amount, organization_name, image_url, status, end_date)
values
  (
    'Supporting our Four Legged Friends',
    'four-legged-friends',
    'Help us provide food, shelter, and medical care for rescued animals in need. Every donation makes a difference in the lives of these wonderful creatures.',
    100000,
    24782.60,
    'Save the Puppies Foundation',
    '/diverse-group-of-happy-people-volunteering-and-hel.jpg',
    'active',
    now() + interval '15 days'
  ),
  (
    'Clean Water for Rural Communities',
    'clean-water-initiative',
    'Bring clean, safe drinking water to communities that need it most. Your support helps build wells and water filtration systems.',
    50000,
    32450.00,
    'Water for Life',
    '/transparent-donation-tracking-dashboard.jpg',
    'active',
    now() + interval '30 days'
  ),
  (
    'Education for Every Child',
    'education-for-all',
    'Provide school supplies, books, and educational resources to underprivileged children. Together we can build a brighter future.',
    75000,
    58920.50,
    'Global Education Fund',
    '/professional-woman-smiling.png',
    'active',
    now() + interval '45 days'
  );

-- Insert sample donations
insert into public.donations (campaign_id, donor_name, donor_email, amount, payment_method, payment_status, is_anonymous, message, source)
select 
  c.id,
  'Alex Hudson',
  'alex@example.com',
  250.00,
  'stripe',
  'completed',
  false,
  'Great job! Proud to support this cause.',
  'web'
from public.campaigns c where c.slug = 'four-legged-friends';

insert into public.donations (campaign_id, donor_name, donor_email, amount, payment_method, payment_status, is_anonymous, source)
select 
  c.id,
  'Corey Delegado',
  'corey@example.com',
  500.00,
  'paypal',
  'completed',
  false,
  'web'
from public.campaigns c where c.slug = 'four-legged-friends';

insert into public.donations (campaign_id, donor_name, amount, payment_method, payment_status, is_anonymous, source)
select 
  c.id,
  'Anonymous Donor',
  150.00,
  'square',
  'completed',
  true,
  'kiosk'
from public.campaigns c where c.slug = 'four-legged-friends';
