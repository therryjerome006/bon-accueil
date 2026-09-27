-- Remise à zéro des données de test (Supabase → SQL Editor)
-- Conserve : tous les comptes (auth.users + profiles), catalogue (chambres, tables, activités)
-- Supprime : réservations, notifications

BEGIN;

TRUNCATE TABLE
  public.activity_bookings,
  public.table_reservations,
  public.reservations,
  public.notifications
RESTART IDENTITY;

COMMIT;

SELECT
  (SELECT count(*) FROM public.reservations) AS reservations,
  (SELECT count(*) FROM public.table_reservations) AS table_reservations,
  (SELECT count(*) FROM public.activity_bookings) AS activity_bookings,
  (SELECT count(*) FROM public.notifications) AS notifications,
  (SELECT count(*) FROM public.profiles) AS profiles,
  (SELECT count(*) FROM public.rooms) AS rooms;
