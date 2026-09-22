-- Manual QR payment workflow. Registration rows are created only after final submission.

alter table registrations drop constraint if exists registrations_status_check;

-- Convert rows created by the previous gateway-based workflow before adding
-- the new status constraint. Existing PAID rows remain confirmed; pending
-- and unresolved gateway rows require manual verification.
update registrations
set status = case status
  when 'PENDING' then 'PENDING_VERIFICATION'
  when 'PAID' then 'PAYMENT_CONFIRMED'
  when 'FAILED' then 'REJECTED'
  when 'REFUNDED' then 'REJECTED'
  when 'CANCELLED' then 'CANCELLED'
  when 'PENDING_VERIFICATION' then 'PENDING_VERIFICATION'
  when 'UNDER_VERIFICATION' then 'UNDER_VERIFICATION'
  when 'PAYMENT_CONFIRMED' then 'PAYMENT_CONFIRMED'
  when 'REJECTED' then 'REJECTED'
  else 'PENDING_VERIFICATION'
end;

alter table registrations add constraint registrations_status_check check (
  status in ('PENDING_VERIFICATION', 'UNDER_VERIFICATION', 'PAYMENT_CONFIRMED', 'REJECTED', 'CANCELLED')
);

alter table registrations
  add column if not exists payment_amount integer,
  add column if not exists payment_screenshot_path text,
  add column if not exists payment_reference text,
  add column if not exists payment_submitted_at timestamptz,
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by uuid references auth.users(id);

create table if not exists registration_status_history (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references registrations(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid references auth.users(id),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists registration_notes (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references registrations(id) on delete cascade,
  author_id uuid references auth.users(id),
  note text not null,
  created_at timestamptz not null default now()
);

alter table registration_status_history enable row level security;
alter table registration_notes enable row level security;

drop policy if exists "admins read status history" on registration_status_history;
drop policy if exists "admins manage status history" on registration_status_history;
drop policy if exists "admins read notes" on registration_notes;
drop policy if exists "admins manage notes" on registration_notes;

create policy "admins read status history" on registration_status_history for select using (is_admin());
create policy "admins manage status history" on registration_status_history for all using (is_admin()) with check (is_admin());
create policy "admins read notes" on registration_notes for select using (is_admin());
create policy "admins manage notes" on registration_notes for all using (is_admin()) with check (is_admin());

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do update set public = false;

drop policy if exists "admins read payment proofs" on storage.objects;
create policy "admins read payment proofs" on storage.objects for select
  using (bucket_id = 'payment-proofs' and is_admin());