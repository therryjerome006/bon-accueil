-- Politiques admin : accès complet via is_admin() pour les opérations CRUD côté client authentifié
-- Les API admin utilisent service_role ; ces policies couvrent un usage direct Supabase si besoin.

DROP POLICY IF EXISTS "Admins manage rooms" ON rooms;
CREATE POLICY "Admins manage rooms"
  ON rooms FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage activities" ON activities;
CREATE POLICY "Admins manage activities"
  ON activities FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage restaurant_tables" ON restaurant_tables;
CREATE POLICY "Admins manage restaurant_tables"
  ON restaurant_tables FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage reservations" ON reservations;
CREATE POLICY "Admins manage reservations"
  ON reservations FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage table_reservations" ON table_reservations;
CREATE POLICY "Admins manage table_reservations"
  ON table_reservations FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON public.reservation_stats_monthly TO authenticated;
GRANT SELECT ON public.occupancy_stats TO authenticated;
