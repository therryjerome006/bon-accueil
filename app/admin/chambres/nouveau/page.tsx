import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminRoomForm } from "@/components/admin/AdminRoomForm";

export const metadata: Metadata = {
  title: "Nouvelle chambre — Admin",
};

export default async function AdminNewRoomPage() {
  await requireAdmin();

  return (
    <div>
      <Link href="/admin/chambres" className="text-sm text-palm-deep hover:opacity-70 mb-4 inline-block">
        ← Retour aux chambres
      </Link>
      <h1 className="font-display text-3xl text-palm-deep mb-8">Ajouter une chambre</h1>
      <AdminRoomForm />
    </div>
  );
}
