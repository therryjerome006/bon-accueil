import type { Database } from "@/types/database.types";

type UserRole = Database["public"]["Enums"]["user_role"];

export function getPostLoginPath(role: UserRole | undefined): string {
  return role === "admin" ? "/admin" : "/compte";
}

/** Empêche les open redirects — accepte uniquement les chemins internes */
export function safeRedirectPath(path: string | null | undefined, fallback: string): string {
  if (!path) return fallback;
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return fallback;
  }
  return path;
}
