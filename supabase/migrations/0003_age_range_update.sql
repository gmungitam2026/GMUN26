-- Updates the eligible age range from 12-22 to 12-23.
-- Run in the Supabase SQL editor against a project that already has
-- 0001_init.sql and 0002_registration_fields.sql applied.

alter table registrations drop constraint if exists registrations_age_check;
alter table registrations add constraint registrations_age_check check (age >= 12 and age <= 23);
