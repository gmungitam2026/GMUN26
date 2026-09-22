begin;

-- Related status history, internal notes, and legacy payment rows are removed
-- by the registrations foreign-key cascade.
delete from public.registrations;

-- Start registration IDs over for local/test data.
alter sequence public.registration_id_seq restart with 1;

commit;

-- Verify the cleanup.
select
  (select count(*) from public.registrations) as registrations,
  (select count(*) from public.registration_status_history) as status_history,
  (select count(*) from public.registration_notes) as internal_notes,
  (select count(*) from public.payments) as legacy_payments,
  (select count(*) from storage.objects where bucket_id = 'payment-proofs') as payment_proofs;
