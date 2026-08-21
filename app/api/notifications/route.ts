import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { markAllNotificationsRead } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";
import type { NotificationPayload } from "@/lib/notifications";

export async function GET(request: Request) {
  const user = await getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unread") === "1";

  const supabase = await createClient();
  const normalizedEmail = user.email.trim().toLowerCase();

  let query = supabase
    .from("notifications")
    .select("id, type, title, message, payload, read_at, created_at")
    .or(`user_id.eq.${user.id},email.eq.${normalizedEmail}`)
    .order("created_at", { ascending: false })
    .limit(20);

  if (unreadOnly) {
    query = query.is("read_at", null);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    notifications: (data ?? []).map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      message: row.message,
      payload: (row.payload ?? {}) as NotificationPayload,
      readAt: row.read_at,
      createdAt: row.created_at,
    })),
  });
}

export async function POST() {
  const user = await getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  await markAllNotificationsRead(user.id, user.email);
  return NextResponse.json({ success: true });
}
