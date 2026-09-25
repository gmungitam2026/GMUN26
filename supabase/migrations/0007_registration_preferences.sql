-- Extra first-step questions on the registration form: whether the delegate
-- is a GITAM student, a second committee preference (committee_preference
-- remains the first), and a country / portfolio preference.
--
-- Nullable because registrations made before these questions existed have no
-- answers; the app requires all three for every new registration.

alter table registrations
  add column if not exists is_gitam_student boolean,
  add column if not exists committee_preference_2 text,
  add column if not exists country_preference text;

alter table registrations drop constraint if exists registrations_committee_preferences_distinct;
alter table registrations add constraint registrations_committee_preferences_distinct
  check (committee_preference_2 is null or committee_preference_2 <> committee_preference);
