import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/account";

export async function GET() {
  const user = await getUser();
  if (!user?.email) {
    return NextResponse.json({ unread: 0, authenticated: false });
  }

  const unread = await getUnreadNotificationCount(user.id, user.email);
  return NextResponse.json({ unread, authenticated: true });
}
