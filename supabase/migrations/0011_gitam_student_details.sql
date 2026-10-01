-- Migration 0011: Add GITAM registration number and campus to registrations

alter table registrations
  add column if not exists gitam_registration_number text,
  add column if not exists gitam_campus text;

-- Add check constraint for valid campuses when provided
alter table registrations drop constraint if exists registrations_gitam_campus_check;
alter table registrations add constraint registrations_gitam_campus_check
  check (gitam_campus is null or gitam_campus in ('Visakhapatnam', 'Hyderabad', 'Bengaluru'));

-- Ensure GITAM registration numbers are unique among active registrations
-- (Prevents duplicate registrations by the same GITAM student; ignores rejected/cancelled rows)
drop index if exists registrations_gitam_reg_no_key;
create unique index registrations_gitam_reg_no_key
  on registrations (upper(btrim(gitam_registration_number)))
  where status not in ('REJECTED', 'CANCELLED') and gitam_registration_number is not null;
