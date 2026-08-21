import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminActivityForm } from "@/components/admin/AdminActivityForm";

export const metadata: Metadata = {
  title: "Nouvelle activité — Admin",
};

export default async function AdminNewActivityPage() {
  await requireAdmin();

  return (
    <div>
      <Link href="/admin/activites" className="text-sm text-palm-deep hover:opacity-70 mb-4 inline-block">
        ← Retour aux activités
      </Link>
      <h1 className="font-display text-3xl text-palm-deep mb-8">Ajouter une activité</h1>
      <AdminActivityForm />
    </div>
  );
}
