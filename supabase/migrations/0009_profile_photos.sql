-- Delegate profile photos, and direct-to-storage uploads.
--
-- Registration files (profile photo + payment screenshot) are now uploaded by
-- the browser straight to Supabase Storage through one-time signed upload
-- URLs, instead of through a Server Action (capped at 1 MB by Next.js and
-- 4.5 MB by Vercel). The buckets themselves enforce the limits below, and the
-- registration action re-checks each file before saving the registration.

alter table registrations add column if not exists profile_photo_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-photos', 'profile-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'payment-proofs';

drop policy if exists "admins read profile photos" on storage.objects;
create policy "admins read profile photos" on storage.objects for select
  using (bucket_id = 'profile-photos' and is_admin());
