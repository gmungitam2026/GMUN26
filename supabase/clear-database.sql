-- ============================================================================
-- GMUN 5.0 Database Cleanup Script
-- ============================================================================
-- Purpose:
--   Clears all transactional/user data (registrations, payments, uploaded files,
--   status history, notes) while keeping the database structure, schema,
--   constraints, triggers, configuration, packages, and committees intact.
--
-- Instructions:
--   1. Open your Supabase project dashboard (or PostgreSQL client).
--   2. Go to the "SQL Editor" section.
--   3. Paste the contents of this file and click "Run".
-- ============================================================================

begin;

-- 1. Remove all registration-related data
-- (Cascades automatically remove status history, notes, and payments,
-- but explicit deletes are included to guarantee no orphaned records)
delete from public.registration_status_history;
delete from public.registration_notes;
delete from public.payments;
delete from public.registrations;

-- 2. Remove all uploaded files (profile photos & payment screenshots) from storage
delete from storage.objects where bucket_id in ('profile-photos', 'payment-proofs');

-- 3. Reset the registration ID sequence so numbering restarts at MUN26-0001
alter sequence if exists public.registration_id_seq restart with 1;

-- ----------------------------------------------------------------------------
-- OPTIONAL RESETS (Uncomment if needed):
-- ----------------------------------------------------------------------------
-- Reset platform settings to defaults (registration open = true)
-- update public.platform_settings set registration_open = true where id = true;

-- Remove all admin profiles (Auth users in auth.users must be removed separately in Supabase Auth):
-- delete from public.admin_profiles;
-- ----------------------------------------------------------------------------

commit;

-- ============================================================================
-- Verification: Check that table counts are 0 while structure & lookup data remain
-- ============================================================================
select
  (select count(*) from public.registrations) as registrations_count,
  (select count(*) from public.registration_status_history) as status_history_count,
  (select count(*) from public.registration_notes) as notes_count,
  (select count(*) from public.payments) as payments_count,
  (select count(*) from storage.objects where bucket_id in ('profile-photos', 'payment-proofs')) as storage_files_count,
  (select count(*) from public.committees) as committees_kept,
  (select count(*) from public.registration_packages) as packages_kept,
  (select count(*) from public.admin_profiles) as admin_profiles_kept;

