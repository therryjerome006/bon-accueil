import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getStatsForPeriod, type Period } from "@/lib/admin/stats";
import { StatsPeriodTabs } from "@/components/admin/AdminFilters";

export const metadata: Metadata = {
  title: "Statistiques — Admin Bon Accueil",
};

type PageProps = {
  searchParams: Promise<{ period?: string }>;
};

export default async function AdminStatsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const { period: periodParam } = await searchParams;
  const period = (["month", "quarter", "semester"].includes(periodParam ?? "")
    ? periodParam
    : "month") as Period;

  const stats = await getStatsForPeriod(period);

  return (
    <div>
      <h1 className="font-display text-3xl text-palm-deep mb-2">Statistiques & livre de comptes</h1>
      <p className="text-sm text-ink/70 mb-6">{stats.periodLabel}</p>

      <StatsPeriodTabs current={period} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Réservations", value: stats.totalReservations },
          { label: "Revenus confirmés", value: `${stats.revenue} $` },
          { label: "Nuits réservées", value: stats.nightsBooked },
          { label: "Nouveaux utilisateurs", value: stats.newUsers },
          { label: "Taux confirmation", value: `${stats.occupancyRate}%` },
          { label: "En attente", value: stats.byStatus.pending },
          { label: "Confirmées", value: stats.byStatus.confirmed },
          { label: "Annulées / refusées", value: stats.byStatus.cancelled + stats.byStatus.rejected },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-palm-soft/50 rounded-sm p-5">
            <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">{label}</p>
            <p className="font-display text-2xl text-palm-deep">{value}</p>
          </div>
        ))}
      </div>

      {stats.byMonth.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-xl text-palm-deep mb-4">Par mois</h2>
          <div className="overflow-x-auto border border-palm-soft/50 rounded-sm bg-white">
            <table className="w-full text-sm">
              <thead className="bg-sand/40 text-left text-xs uppercase tracking-wide text-ink/60">
                <tr>
                  <th className="px-4 py-3">Mois</th>
                  <th className="px-4 py-3">Réservations</th>
                  <th className="px-4 py-3">Revenus</th>
                </tr>
              </thead>
              <tbody>
                {stats.byMonth.map((row) => (
                  <tr key={row.month} className="border-t border-palm-soft/30">
                    <td className="px-4 py-3">{row.month}</td>
                    <td className="px-4 py-3">{row.count}</td>
                    <td className="px-4 py-3">{row.revenue} $</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl text-palm-deep mb-4">Livre de comptes — entrées confirmées</h2>
        {stats.ledger.length === 0 ? (
          <p className="text-sm text-ink/50">Aucune entrée sur cette période.</p>
        ) : (
          <div className="overflow-x-auto border border-palm-soft/50 rounded-sm bg-white">
            <table className="w-full text-sm">
              <thead className="bg-sand/40 text-left text-xs uppercase tracking-wide text-ink/60">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Séjour</th>
                  <th className="px-4 py-3">Nuits</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Référence</th>
                </tr>
              </thead>
              <tbody>
                {stats.ledger.map((row) => (
                  <tr key={row.id} className="border-t border-palm-soft/30">
                    <td className="px-4 py-3">{row.date}</td>
                    <td className="px-4 py-3">{row.guest}</td>
                    <td className="px-4 py-3 text-xs">{row.checkIn} → {row.checkOut}</td>
                    <td className="px-4 py-3">{row.nights ?? "—"}</td>
                    <td className="px-4 py-3 font-medium">{row.amount != null ? `${row.amount} $` : "—"}</td>
                    <td className="px-4 py-3 text-xs break-all max-w-[120px]">{row.transaction ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-sand/30 font-medium">
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right">Total période</td>
                  <td className="px-4 py-3">{stats.revenue} $</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
