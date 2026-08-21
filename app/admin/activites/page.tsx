import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminDb } from "@/lib/admin/db";
import { formatActivityDate } from "@/lib/activities";

export const metadata: Metadata = {
  title: "Événements groupes — Admin Bon Accueil",
};

export default async function AdminActivitesPage() {
  await requireAdmin();
  const db = getAdminDb();
  const { data: activities } = await db.from("activities").select("*").order("date", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-palm-deep">Événements groupes</h1>
        <Link
          href="/admin/activites/nouveau"
          className="px-5 py-2.5 text-sm bg-palm-deep text-linen rounded-sm hover:bg-palm"
        >
          + Ajouter (legacy)
        </Link>
      </div>

      <div className="mb-8 p-4 bg-sand/60 border border-palm-soft/40 rounded-sm text-sm text-ink/80 leading-relaxed">
        La page publique <strong>/activites</strong> affiche les offres groupes depuis{" "}
        <code className="text-xs bg-white px-1 py-0.5 rounded">lib/group-events.ts</code> (fêtes,
        journées piscine, sorties scolaires, services traiteur). La table ci-dessous est l&apos;ancien
        système d&apos;excursions — vous pouvez la vider avec{" "}
        <code className="text-xs bg-white px-1 py-0.5 rounded">DELETE FROM activities;</code>
      </div>

      {!activities?.length ? (
        <p className="text-sm text-ink/50">Aucune entrée legacy en base.</p>
      ) : (
        <div className="overflow-x-auto border border-palm-soft/50 rounded-sm bg-white">
          <table className="w-full text-sm">
            <thead className="bg-sand/40 text-left text-xs uppercase tracking-wide text-ink/60">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className="border-t border-palm-soft/30">
                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3">{formatActivityDate(a.date)}</td>
                  <td className="px-4 py-3">{a.price} $</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/activites/${a.id}`} className="text-palm-deep hover:opacity-70">
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
