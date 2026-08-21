import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminDb } from "@/lib/admin/db";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata: Metadata = {
  title: "Restaurant — Admin Bon Accueil",
};

export default async function AdminRestaurantPage() {
  await requireAdmin();
  const db = getAdminDb();

  const [{ data: tables }, { data: reservations }] = await Promise.all([
    db.from("restaurant_tables").select("*").order("capacity", { ascending: true }),
    db
      .from("table_reservations")
      .select("*, restaurant_tables(name)")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-palm-deep">Restaurant</h1>
        <Link
          href="/admin/restaurant/nouveau"
          className="px-5 py-2.5 text-sm bg-palm-deep text-linen rounded-sm hover:bg-palm"
        >
          + Ajouter une table
        </Link>
      </div>

      <section className="mb-10">
        <h2 className="font-display text-xl text-palm-deep mb-4">Tables</h2>
        {!tables?.length ? (
          <p className="text-sm text-ink/50">Aucune table configurée.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {tables.map((t) => (
              <div key={t.id} className="bg-white border border-palm-soft/50 rounded-sm p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-palm-deep">{t.name}</h3>
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-xs text-ink/60 mb-3">{t.capacity} personnes max.</p>
                <Link href={`/admin/restaurant/${t.id}`} className="text-sm text-palm-deep hover:opacity-70">
                  Modifier
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl text-palm-deep mb-4">Dernières réservations</h2>
        <Link href="/admin/reservations?status=pending" className="text-sm text-palm mb-4 inline-block hover:opacity-70">
          Voir toutes les réservations →
        </Link>
        {!reservations?.length ? (
          <p className="text-sm text-ink/50">Aucune réservation récente.</p>
        ) : (
          <div className="overflow-x-auto border border-palm-soft/50 rounded-sm bg-white">
            <table className="w-full text-sm">
              <thead className="bg-sand/40 text-left text-xs uppercase tracking-wide text-ink/60">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Table</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-t border-palm-soft/30">
                    <td className="px-4 py-3">{r.first_name} {r.last_name}</td>
                    <td className="px-4 py-3">{(r.restaurant_tables as { name?: string } | null)?.name}</td>
                    <td className="px-4 py-3">{r.reservation_date} {r.reservation_time}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
