-- Single-row settings table the admin dashboard can toggle. Starts with
-- just registration open/closed; safe to add more flags later.

create table platform_settings (
  id boolean primary key default true check (id = true), -- enforces a single row
  registration_open boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into platform_settings (id, registration_open) values (true, true);

alter table platform_settings enable row level security;

create policy "public read platform settings" on platform_settings
  for select using (true);

create policy "admin update platform settings" on platform_settings
  for update using (is_admin()) with check (is_admin());
