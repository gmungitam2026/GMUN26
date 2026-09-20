-- GMUN 5.0 platform schema
-- Run with `supabase db push` (or via the SQL editor) against a Supabase project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- registration_packages — pricing is data, never hardcoded in application UI
-- ---------------------------------------------------------------------------
create table registration_packages (
  id text primary key,
  name text not null,
  description text not null default '',
  price integer not null check (price >= 0), -- INR, whole rupees
  currency text not null default 'INR',
  active boolean not null default true,
  display_order integer not null default 0,
  includes text[] not null default '{}',
  capacity integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger registration_packages_set_updated_at
  before update on registration_packages
  for each row execute function set_updated_at();

-- Seed reflects the GMUN 5.0 client requirements document as it stands today.
-- This is data, not application code — update/insert rows here (or via the
-- admin dashboard once built) as pricing decisions are finalised.
insert into registration_packages (id, name, description, price, currency, active, display_order, includes)
values (
  'gmun-5-delegate',
  'GMUN 5.0 Delegate Registration',
  'Conference participation for GMUN 5.0, 24-25 October 2026.',
  600,
  'INR',
  true,
  1,
  array['Conference participation']
);

-- ---------------------------------------------------------------------------
-- committees — kept in the database so committee content can change without
-- a frontend deploy. Seeded from the client-supplied committee list.
-- ---------------------------------------------------------------------------
create table committees (
  id text primary key,
  short_name text not null,
  name text not null,
  governing_body text,
  agenda text not null,
  description text not null,
  type text not null,
  display_order integer not null default 0,
  study_guide_url text,
  capacity integer,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger committees_set_updated_at
  before update on committees
  for each row execute function set_updated_at();

insert into committees (id, short_name, name, governing_body, agenda, description, type, display_order) values
('unea', 'UNEA', 'United Nations Environment Assembly', 'Governing body of UNEP',
 'Regulating the Global Water Footprint of Artificial Intelligence: Addressing Emerging Challenges and Promoting Inclusive Water Governance',
 'The United Nations Environment Assembly is the world''s highest-level decision-making body on environmental matters, established in 2012 following the Rio+20 Conference. It brings together all 193 UN Member States to set the global environmental agenda, shape international environmental law, and mobilise funding for ecological action.',
 'General', 1),
('unhrc', 'UNHRC', 'United Nations Human Rights Council', null,
 'Regulating Illicit Arms Trade and Trafficking: Curbing Acquisition by Terrorist and Non-State Armed Actors.',
 'The UNHRC is a 47-member inter-governmental body established in 2006 to promote and protect human rights worldwide. It addresses situations of human rights violations, conducts the Universal Periodic Review of every Member State''s human rights record, and works through Special Rapporteurs and independent experts.',
 'General', 2),
('media-info', 'UN Ad-hoc Committee', 'UN Ad-hoc Committee on Media and Information', 'Modelled on the UN Committee on Information (UNGA Fourth Committee)',
 'Safeguarding Press Freedom and Ensuring Freedom of Speech and Expression While Combating the Rise of Misinformation in the Contemporary World',
 'This committee is modelled on the real UN Committee on Information, established in 1978 to examine global public-information policy and promote a free, balanced flow of news and data.',
 'Special', 3),
('disec', 'UNGA-DISEC', 'Disarmament and International Security Committee', 'UNGA First Committee',
 'Regulating Illicit Arms Trade and Trafficking: Curbing Acquisition by Terrorist and Non-State Armed Actors',
 'DISEC is the first of the UN General Assembly''s six main committees, open to all 193 Member States, and is dedicated to disarmament and international security.',
 'General', 4),
('mcu', 'MCU', 'Marvel Cinematic Universe Committee', 'Crisis simulation committee',
 'Reaffirming States'' Obligations to Protect: Ensuring Accountability for Abuses of State Power',
 'This special crisis committee places delegates within the fictional world of the Marvel Cinematic Universe, representing superheroes, organisations such as S.H.I.E.L.D. or the Avengers, and governmental bodies operating within that universe.',
 'Crisis', 5),
('ifi', 'IFI', 'Indian Film Industry Committee', null,
 'The Price of a Surname: Nepotism and the Fight for a Place in Indian Cinema',
 'This committee simulates the ecosystem of the Indian film industry, spanning Bollywood and regional cinema alongside production houses, streaming platforms, and regulatory bodies like the Central Board of Film Certification.',
 'Special', 6),
('fifa', 'FIFA', 'Fédération Internationale de Football Association', null,
 'To be announced',
 'This committee simulates FIFA, the global governing body of association football, comprising 211 member associations. Delegates represent national federations, confederations, or FIFA''s own executive bodies.',
 'Special', 7);

-- ---------------------------------------------------------------------------
-- registrations
-- ---------------------------------------------------------------------------
create sequence registration_id_seq start 1;

-- Generates MUN26-0001-style IDs server-side (sequence, not client input).
create or replace function generate_registration_id()
returns text as $$
declare
  next_val integer;
begin
  next_val := nextval('registration_id_seq');
  return 'MUN26-' || lpad(next_val::text, 4, '0');
end;
$$ language plpgsql;

create table registrations (
  id uuid primary key default gen_random_uuid(),
  registration_id text not null unique default generate_registration_id(),

  full_name text not null,
  email text not null,
  phone text not null,
  college text not null,
  course text not null,
  year text not null,
  city text not null,

  participant_type text not null,
  committee_preference text not null references committees(id),
  country_preference text,
  mun_experience text not null,
  muns_attended integer not null default 0,

  tshirt_size text,
  accommodation boolean,
  food_preference text,
  emergency_contact_name text,
  emergency_contact_phone text,
  referral_source text,
  special_requirements text,

  package_id text not null references registration_packages(id),
  status text not null default 'PENDING' check (status in ('PENDING', 'PAID', 'CANCELLED')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One active registration per email/phone; prevents accidental duplicate
-- registrations without blocking legitimate multi-year re-registration once
-- a prior attempt was cancelled.
create unique index registrations_email_active_idx on registrations (lower(email))
  where status <> 'CANCELLED';
create unique index registrations_phone_active_idx on registrations (phone)
  where status <> 'CANCELLED';

create trigger registrations_set_updated_at
  before update on registrations
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------------
create table payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references registrations(id) on delete cascade,

  provider text not null,
  order_id text not null,
  payment_id text,
  amount integer not null,
  currency text not null default 'INR',
  status text not null default 'PENDING' check (status in ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED')),
  method text,
  provider_reference text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_registration_id_idx on payments (registration_id);
create unique index payments_order_id_idx on payments (provider, order_id);

create trigger payments_set_updated_at
  before update on payments
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- admin_profiles — explicit authorization, not "every authenticated user"
-- ---------------------------------------------------------------------------
create table admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'ADMIN' check (role in ('ADMIN', 'SUPER_ADMIN')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table registration_packages enable row level security;
alter table committees enable row level security;
alter table registrations enable row level security;
alter table payments enable row level security;
alter table admin_profiles enable row level security;

create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from admin_profiles where id = auth.uid());
$$ language sql security definer stable;

-- Public can read active packages/committees (needed to render the site).
create policy "public read active packages" on registration_packages
  for select using (active = true);
create policy "admin manage packages" on registration_packages
  for all using (is_admin()) with check (is_admin());

create policy "public read active committees" on committees
  for select using (active = true);
create policy "admin manage committees" on committees
  for all using (is_admin()) with check (is_admin());

-- Public can create a registration (the registration form), but cannot read
-- any registration back, including their own, via the public client — the
-- confirmation page reads through a server-side (service role) route instead.
create policy "public insert registration" on registrations
  for insert with check (status = 'PENDING');
create policy "admin read registrations" on registrations
  for select using (is_admin());
create policy "admin update registrations" on registrations
  for update using (is_admin()) with check (is_admin());

-- Payments are never exposed to the public client, only server (service
-- role) code and admins.
create policy "admin read payments" on payments
  for select using (is_admin());
create policy "admin manage payments" on payments
  for all using (is_admin()) with check (is_admin());

create policy "admin read admin_profiles" on admin_profiles
  for select using (is_admin());
