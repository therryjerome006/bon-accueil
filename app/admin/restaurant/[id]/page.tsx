import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAdminDb } from "@/lib/admin/db";
import { getSiteImages } from "@/lib/image-gallery.server";
import { AdminTableForm } from "@/components/admin/AdminTableForm";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditTablePage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const db = getAdminDb();
  const { data: table } = await db.from("restaurant_tables").select("*").eq("id", id).maybeSingle();

  if (!table) notFound();

  const imageFallback = getSiteImages().restaurant.fallback;

  return (
    <div>
      <Link href="/admin/restaurant" className="text-sm text-palm-deep hover:opacity-70 mb-4 inline-block">
        ← Retour au restaurant
      </Link>
      <h1 className="font-display text-3xl text-palm-deep mb-8">Modifier — {table.name}</h1>
      <AdminTableForm table={table} imageFallback={imageFallback} />
    </div>
  );
}
