-- Fonctions PostgreSQL requises par l'application
-- Exécuter dans Supabase → SQL Editor

-- Vérifie si l'utilisateur connecté est admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Vérifie la disponibilité d'une chambre (pas de chevauchement avec réservations actives)
CREATE OR REPLACE FUNCTION public.is_room_available(
  p_room_id uuid,
  p_check_in date,
  p_check_out date,
  p_exclude_reservation_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1
    FROM public.reservations r
    WHERE r.room_id = p_room_id
      AND r.status IN ('pending', 'confirmed')
      AND (p_exclude_reservation_id IS NULL OR r.id <> p_exclude_reservation_id)
      AND p_check_in < r.check_out::date
      AND p_check_out > r.check_in::date
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.is_room_available(uuid, date, date, uuid) TO authenticated, anon, service_role;

-- Le propriétaire de la fonction (postgres) doit pouvoir lire reservations en SECURITY DEFINER
GRANT SELECT ON public.reservations TO postgres, service_role;
