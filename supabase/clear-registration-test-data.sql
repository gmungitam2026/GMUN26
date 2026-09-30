begin;

-- Remove all registration records and related history/notes/payments
delete from public.registration_status_history;
delete from public.registration_notes;
delete from public.payments;
delete from public.registrations;

-- Start registration IDs over at MUN26-0001
alter sequence if exists public.registration_id_seq restart with 1;

commit;

-- Verify the cleanup
select
  (select count(*) from public.registrations) as registrations,
  (select count(*) from public.registration_status_history) as status_history,
  (select count(*) from public.registration_notes) as internal_notes,
  (select count(*) from public.payments) as payments;

