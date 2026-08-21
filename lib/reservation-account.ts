export {
  hasRegisteredAccount,
  resolveUserIdByEmail,
} from "@/lib/notifications";

export type ReservationAudience = "account" | "guest";

export async function getReservationAudience(
  userId?: string | null,
  email?: string,
): Promise<ReservationAudience> {
  const { hasRegisteredAccount } = await import("@/lib/notifications");
  return (await hasRegisteredAccount(userId, email)) ? "account" : "guest";
}
