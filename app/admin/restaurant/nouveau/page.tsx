import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminTableForm } from "@/components/admin/AdminTableForm";

export const metadata: Metadata = {
  title: "Nouvelle table — Admin",
};

export default async function AdminNewTablePage() {
  await requireAdmin();

  return (
    <div>
      <Link href="/admin/restaurant" className="text-sm text-palm-deep hover:opacity-70 mb-4 inline-block">
        ← Retour au restaurant
      </Link>
      <h1 className="font-display text-3xl text-palm-deep mb-8">Ajouter une table</h1>
      <AdminTableForm />
    </div>
  );
}
