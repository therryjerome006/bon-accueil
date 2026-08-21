import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAdminDb } from "@/lib/admin/db";
import { AdminActivityForm } from "@/components/admin/AdminActivityForm";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditActivityPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const db = getAdminDb();
  const { data: activity } = await db.from("activities").select("*").eq("id", id).maybeSingle();

  if (!activity) notFound();

  return (
    <div>
      <Link href="/admin/activites" className="text-sm text-palm-deep hover:opacity-70 mb-4 inline-block">
        ← Retour aux activités
      </Link>
      <h1 className="font-display text-3xl text-palm-deep mb-8">Modifier — {activity.title}</h1>
      <AdminActivityForm activity={activity} />
    </div>
  );
}
