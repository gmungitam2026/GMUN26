-- Every registration must carry a UTR / payment reference, and no two
-- registrations may share one (compared case-insensitively). A UTR identifies
-- a single bank transaction, so a reused UTR means a reused payment.
--
-- The app stores UTRs normalised (whitespace removed, upper-case); the index
-- is on upper(btrim(...)) so older rows entered before normalisation are
-- covered too.
--
-- If this migration stops with an error, some existing rows already share a
-- UTR or have none. Resolve those rows (e.g. delete test submissions or
-- correct the reference) and run it again.

do $$
declare
  dupes text;
  missing integer;
begin
  select string_agg(format('%s → %s', utr, ids), E'\n')
    into dupes
  from (
    select upper(btrim(payment_reference)) as utr,
           string_agg(registration_id || ' (' || status || ')', ', ' order by created_at) as ids
    from registrations
    where payment_reference is not null
    group by 1
    having count(*) > 1
  ) d;

  if dupes is not null then
    raise exception E'Duplicate UTRs found; resolve these registrations first:\n%', dupes;
  end if;

  select count(*) into missing from registrations where payment_reference is null or btrim(payment_reference) = '';
  if missing > 0 then
    raise exception '% registration(s) have no UTR; add one or remove them first.', missing;
  end if;
end $$;

alter table registrations alter column payment_reference set not null;

create unique index if not exists registrations_payment_reference_key
  on registrations (upper(btrim(payment_reference)));
