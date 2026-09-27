-- Bucket public pour les photos de chambres (URLs stockées dans rooms.images)
-- Exécuter dans Supabase → SQL Editor une fois par projet.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'room-images',
  'room-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lecture publique (site vitrine)
create policy "room_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'room-images');

-- Écriture réservée au service role (API admin Next.js) — pas de policy insert anon/authenticated
