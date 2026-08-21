import { createAdminClient } from "@/lib/supabase/admin";

export function getAdminDb() {
  return createAdminClient();
}
