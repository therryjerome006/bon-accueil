-- Buckets publics : photos + vidéos MP4 (chambres et tables)
-- Exécuter dans Supabase → SQL Editor (remplace / complète storage-room-images.sql)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'room-images',
  'room-images',
  true,
  52428800,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'table-images',
  'table-images',
  true,
  52428800,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "room_images_public_read" on storage.objects;
create policy "room_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'room-images');

drop policy if exists "table_images_public_read" on storage.objects;
create policy "table_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'table-images');
