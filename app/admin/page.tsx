import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDashboardStats } from "@/lib/admin/stats";

export const metadata: Metadata = {
  title: "Tableau de bord — Admin Bon Accueil",
};

export default async function AdminDashboardPage() {
  const { profile } = await requireAdmin();
  const stats = await getDashboardStats();

  const cards = [
    { label: "En attente", value: stats.pendingCount, href: "/admin/reservations?status=pending", highlight: true },
    { label: "Réservations chambres", value: stats.totalReservations, href: "/admin/reservations" },
    { label: "Confirmées", value: stats.confirmedReservations, href: "/admin/reservations?status=confirmed" },
    { label: "Revenus (USD)", value: `${stats.revenue} $`, href: "/admin/stats" },
    { label: "Chambres", value: stats.roomCount, href: "/admin/chambres" },
    { label: "Groupes", value: stats.activityCount, href: "/admin/activites" },
    { label: "Utilisateurs", value: stats.userCount, href: "/admin/stats" },
    { label: "Rés. restaurant", value: stats.tableReservations, href: "/admin/restaurant" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-palm-deep mb-1">Tableau de bord</h1>
      <p className="text-sm text-ink/70 mb-8">
        Bonjour {profile.first_name ?? profile.email}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, href, highlight }) => (
          <Link
            key={label}
            href={href}
            className={`rounded-sm border p-5 transition-shadow hover:shadow-md ${
              highlight ? "border-amber-300 bg-amber-50" : "border-palm-soft/50 bg-white"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">{label}</p>
            <p className="font-display text-2xl text-palm-deep">{value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
