-- ---------------------------------------------------------------------------
-- GMUN 5.0: Update pricing, restore missing columns & enforce unique constraints
-- ---------------------------------------------------------------------------

-- 1. Ensure country_preference column exists
alter table registrations
  add column if not exists country_preference text;

-- 2. Ensure GITAM student columns exist
alter table registrations
  add column if not exists is_gitam_student boolean,
  add column if not exists gitam_registration_number text,
  add column if not exists gitam_campus text;

-- 3. Ensure unique constraints / indexes are strictly enforced for active registrations:
create unique index if not exists registrations_email_key
  on registrations (lower(btrim(email)))
  where status not in ('REJECTED', 'CANCELLED');

create unique index if not exists registrations_phone_key
  on registrations (phone)
  where status not in ('REJECTED', 'CANCELLED');

create unique index if not exists registrations_gitam_reg_no_key
  on registrations (upper(btrim(gitam_registration_number)))
  where status not in ('REJECTED', 'CANCELLED') and gitam_registration_number is not null;

-- 4. Deactivate legacy single-tier package if present
update registration_packages set active = false where id = 'gmun-5-delegate';

-- 5. Upsert the 3 current package tiers (₹600, ₹900, ₹1900)
insert into registration_packages (id, name, description, price, currency, active, display_order, includes)
values
  ('gmun-only', 'GMUN Only', 'Two-day conference entry.', 600, 'INR', true, 1, array['Two-day conference entry (both days)']),
  ('gmun-lunch', 'GMUN + Lunch', 'Two-day conference entry with lunch included.', 900, 'INR', true, 2, array['Two-day conference entry (both days)', 'Lunch']),
  ('gmun-lunch-accommodation', 'GMUN + Lunch + Accommodation', 'Two-day conference entry with lunch and accommodation included.', 1900, 'INR', true, 3, array['Two-day conference entry (both days)', 'Lunch', 'Accommodation'])
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  active = excluded.active,
  display_order = excluded.display_order,
  includes = excluded.includes;
