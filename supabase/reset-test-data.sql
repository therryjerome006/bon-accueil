-- Remise à zéro des données de test (Supabase → SQL Editor)
-- Conserve : chambres, activités, tables restaurant, comptes admin
-- Supprime : réservations chambres, réservations restaurant, inscriptions activités

BEGIN;

TRUNCATE TABLE activity_bookings, table_reservations, reservations RESTART IDENTITY;

DELETE FROM profiles WHERE role <> 'admin';

COMMIT;

-- Comptes auth : supprimez les utilisateurs non-admin dans
-- Supabase Dashboard → Authentication → Users
-- ou exécutez : node scripts/reset-test-data.mjs --confirm

SELECT
  (SELECT count(*) FROM reservations) AS reservations,
  (SELECT count(*) FROM table_reservations) AS table_reservations,
  (SELECT count(*) FROM activity_bookings) AS activity_bookings,
  (SELECT count(*) FROM profiles) AS profiles,
  (SELECT count(*) FROM rooms) AS rooms;
