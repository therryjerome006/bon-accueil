-- Permissions + politiques RLS
-- Exécuter dans Supabase → SQL Editor (tout le fichier d'un coup)

-- 1. Droits sur le schéma et les tables
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT ON public.rooms TO anon, authenticated;
GRANT ALL ON public.rooms TO service_role;

GRANT SELECT ON public.restaurant_tables TO anon, authenticated;
GRANT ALL ON public.restaurant_tables TO service_role;

GRANT SELECT ON public.activities TO anon, authenticated;
GRANT ALL ON public.activities TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO service_role;
-- Requis si is_room_available() est appelée avec la clé anon (secours)
GRANT SELECT ON public.reservations TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.table_reservations TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_bookings TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;

-- 2. Politiques RLS (lecture publique)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read available rooms" ON rooms;
CREATE POLICY "Public read available rooms"
  ON rooms FOR SELECT
  TO anon, authenticated
  USING (status = 'available');

ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read available tables" ON restaurant_tables;
CREATE POLICY "Public read available tables"
  ON restaurant_tables FOR SELECT
  TO anon, authenticated
  USING (status = 'available');

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read activities" ON activities;
CREATE POLICY "Public read activities"
  ON activities FOR SELECT
  TO anon, authenticated
  USING (true);

-- Les réservations sont créées uniquement via service_role (API serveur)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- service_role bypass RLS by default in Supabase, but explicit policy for clarity:
DROP POLICY IF EXISTS "Service role full access reservations" ON reservations;
CREATE POLICY "Service role full access reservations"
  ON reservations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

ALTER TABLE table_reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access table_reservations" ON table_reservations;
CREATE POLICY "Service role full access table_reservations"
  ON table_reservations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

ALTER TABLE activity_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access activity_bookings" ON activity_bookings;
CREATE POLICY "Service role full access activity_bookings"
  ON activity_bookings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
