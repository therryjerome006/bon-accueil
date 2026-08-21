import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAdminDb } from "@/lib/admin/db";
import { AdminRoomForm } from "@/components/admin/AdminRoomForm";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const db = getAdminDb();
  const { data } = await db.from("rooms").select("title").eq("id", id).maybeSingle();
  return { title: data ? `Modifier ${data.title}` : "Chambre — Admin" };
}

export default async function AdminEditRoomPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const db = getAdminDb();
  const { data: room } = await db.from("rooms").select("*").eq("id", id).maybeSingle();

  if (!room) notFound();

  return (
    <div>
      <Link href="/admin/chambres" className="text-sm text-palm-deep hover:opacity-70 mb-4 inline-block">
        ← Retour aux chambres
      </Link>
      <h1 className="font-display text-3xl text-palm-deep mb-8">Modifier — {room.title}</h1>
      <AdminRoomForm room={room} />
    </div>
  );
}
