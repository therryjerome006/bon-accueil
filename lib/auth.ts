import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export type Profile = Tables<"profiles">;

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return profile;
}

export async function isAdminUser(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === "admin";
}

export async function requireUser(redirectTo = "/login") {
  const user = await getUser();
  if (!user) redirect(redirectTo);
  return user;
}

export async function requireAdmin() {
  const user = await requireUser("/login?redirect=/admin");
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") redirect("/compte");
  return { user, profile };
}

export async function getOptionalUserId(): Promise<string | null> {
  const user = await getUser();
  return user?.id ?? null;
}
