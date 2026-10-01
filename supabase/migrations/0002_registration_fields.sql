-- Updates the registrations table and package catalogue to match the
-- finalized registration form fields and the 3-tier package structure.
-- Run in the Supabase SQL editor against a project that already has
-- 0001_init.sql applied.

-- ---------------------------------------------------------------------------
-- registrations: new fields
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'registrations' and column_name = 'college'
  ) then
    alter table registrations rename column college to institution;
  end if;
end $$;

alter table registrations
  add column if not exists age integer,
  add column if not exists gender text,
  add column if not exists state text,
  add column if not exists mun_experience_detail text;

alter table registrations
  drop constraint if exists registrations_age_check,
  drop constraint if exists registrations_gender_check,
  drop constraint if exists registrations_mun_experience_check,
  drop constraint if exists registrations_mun_experience_detail_length;

alter table registrations
  add constraint registrations_age_check check (age >= 12 and age <= 23),
  add constraint registrations_gender_check check (gender in ('Male', 'Female', 'Other', 'Prefer not to say')),
  add constraint registrations_mun_experience_check check (mun_experience in ('Yes', 'No')),
  add constraint registrations_mun_experience_detail_length check (char_length(mun_experience_detail) <= 2000);

-- Fields dropped from the registration form (superseded by the fields above
-- or removed from scope entirely).
alter table registrations
  drop column if exists course,
  drop column if exists year,
  drop column if exists participant_type,
  drop column if exists muns_attended,
  drop column if exists tshirt_size,
  drop column if exists accommodation,
  drop column if exists food_preference,
  drop column if exists emergency_contact_name,
  drop column if exists emergency_contact_phone,
  drop column if exists referral_source,
  drop column if exists special_requirements;

-- ---------------------------------------------------------------------------
-- registration_packages: 3-tier structure
-- ---------------------------------------------------------------------------
update registration_packages set active = false where id = 'gmun-5-delegate';

insert into registration_packages (id, name, description, price, currency, active, display_order, includes)
values
  ('gmun-only', 'GMUN Only', 'Two-day conference entry.', 600, 'INR', true, 1, array['Two-day conference entry (both days)']),
  ('gmun-lunch', 'GMUN + Lunch', 'Two-day conference entry with lunch included.', 860, 'INR', true, 2, array['Two-day conference entry (both days)', 'Lunch']),
  ('gmun-lunch-accommodation', 'GMUN + Lunch + Accommodation', 'Two-day conference entry with lunch and accommodation included.', 1860, 'INR', true, 3, array['Two-day conference entry (both days)', 'Lunch', 'Accommodation'])
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  active = excluded.active,
  display_order = excluded.display_order,
  includes = excluded.includes;
