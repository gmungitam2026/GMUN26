-- A rejected or cancelled registration must not block the same person from
-- registering again. Email, mobile number and UTR stay unique, but only among
-- active registrations (anything not REJECTED / CANCELLED).
--
-- Index names are unchanged so the app's duplicate-error messages keep
-- matching (lib/registration/actions.ts). Registrations never move from
-- REJECTED / CANCELLED back to an active status, so an old row can't collide
-- with a newer one later.
drop index if exists registrations_email_key;
drop index if exists registrations_phone_key;
drop index if exists registrations_payment_reference_key;

create unique index registrations_email_key on registrations (lower(btrim(email)))
  where status not in ('REJECTED', 'CANCELLED');
create unique index registrations_phone_key on registrations (phone)
  where status not in ('REJECTED', 'CANCELLED');
create unique index registrations_payment_reference_key on registrations (upper(btrim(payment_reference)))
  where status not in ('REJECTED', 'CANCELLED');
