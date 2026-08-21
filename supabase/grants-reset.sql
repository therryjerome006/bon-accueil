-- À exécuter une fois si reset-test-data.mjs échoue avec "permission denied"
-- Supabase → SQL Editor

GRANT DELETE ON public.reservations TO service_role;
GRANT DELETE ON public.table_reservations TO service_role;
GRANT DELETE ON public.activity_bookings TO service_role;
GRANT DELETE ON public.profiles TO service_role;

ALTER TABLE table_reservations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access table_reservations" ON table_reservations;
CREATE POLICY "Service role full access table_reservations"
  ON table_reservations FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE activity_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access activity_bookings" ON activity_bookings;
CREATE POLICY "Service role full access activity_bookings"
  ON activity_bookings FOR ALL TO service_role USING (true) WITH CHECK (true);
