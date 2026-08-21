import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminDb } from "@/lib/admin/db";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata: Metadata = {
  title: "Chambres — Admin Bon Accueil",
};

export default async function AdminChambresPage() {
  await requireAdmin();
  const db = getAdminDb();
  const { data: rooms } = await db.from("rooms").select("*").order("price", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-palm-deep">Chambres</h1>
        <Link
          href="/admin/chambres/nouveau"
          className="px-5 py-2.5 text-sm bg-palm-deep text-linen rounded-sm hover:bg-palm"
        >
          + Ajouter une chambre
        </Link>
      </div>

      {!rooms?.length ? (
        <p className="text-sm text-ink/50">Aucune chambre. Ajoutez-en une pour qu&apos;elle apparaisse sur le site.</p>
      ) : (
        <div className="overflow-x-auto border border-palm-soft/50 rounded-sm bg-white">
          <table className="w-full text-sm">
            <thead className="bg-sand/40 text-left text-xs uppercase tracking-wide text-ink/60">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Cap.</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Accueil</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-t border-palm-soft/30">
                  <td className="px-4 py-3 font-medium">{room.title}</td>
                  <td className="px-4 py-3">{room.price} $</td>
                  <td className="px-4 py-3">{room.capacity}</td>
                  <td className="px-4 py-3"><StatusBadge status={room.status} /></td>
                  <td className="px-4 py-3">{room.is_featured ? "Oui" : "—"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/chambres/${room.id}`} className="text-palm-deep hover:opacity-70">
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
