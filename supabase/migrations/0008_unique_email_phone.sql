-- Email and mobile number are unique across every registration, whatever its
-- status. This replaces the partial indexes from 0001_init.sql, which let a
-- cancelled registration's email / phone be reused.

do $$
declare
  dupes text;
begin
  select string_agg(format('%s %s → %s', kind, value, ids), E'\n')
    into dupes
  from (
    select 'email' as kind, lower(btrim(email)) as value,
           string_agg(registration_id || ' (' || status || ')', ', ' order by created_at) as ids
    from registrations group by 2 having count(*) > 1
    union all
    select 'phone', phone,
           string_agg(registration_id || ' (' || status || ')', ', ' order by created_at)
    from registrations group by 2 having count(*) > 1
  ) d;

  if dupes is not null then
    raise exception E'Duplicate emails / phone numbers found; resolve these registrations first:\n%', dupes;
  end if;
end $$;

drop index if exists registrations_email_active_idx;
drop index if exists registrations_phone_active_idx;

create unique index if not exists registrations_email_key on registrations (lower(btrim(email)));
create unique index if not exists registrations_phone_key on registrations (phone);
