import Link from "next/link";
import { Bell, Bed, UtensilsCrossed } from "lucide-react";
import {
  reservationStatusLabel,
  type ClientDashboardData,
  type ClientNotification,
} from "@/lib/account";

type ClientAccountDashboardProps = {
  dashboard: ClientDashboardData;
  userName?: string | null;
};

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-900 border-amber-200",
    confirmed: "bg-green-50 text-green-900 border-green-200",
    rejected: "bg-red-50 text-red-800 border-red-200",
    cancelled: "bg-ink/5 text-ink/60 border-ink/10",
  };

  return (
    <span
      className={`inline-block text-xs px-2 py-0.5 rounded-sm border ${styles[status] ?? "bg-sand text-ink/70 border-palm-soft/40"}`}
    >
      {reservationStatusLabel(status)}
    </span>
  );
}

function NotificationCard({ notification }: { notification: ClientNotification }) {
  const unread = !notification.readAt;

  return (
    <article
      className={`rounded-sm border p-4 text-sm ${unread ? "border-palm bg-palm-soft/10" : "border-palm-soft/50 bg-white"}`}
    >
      <div className="flex items-start gap-3">
        <Bell size={16} className={`shrink-0 mt-0.5 ${unread ? "text-palm" : "text-ink/40"}`} />
        <div className="min-w-0">
          <p className="font-medium text-palm-deep">{notification.title}</p>
          <p className="text-ink/80 mt-1 leading-relaxed">{notification.message}</p>
          <p className="text-xs text-ink/45 mt-2">
            {new Date(notification.createdAt).toLocaleString("fr-FR", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>
    </article>
  );
}

export function ClientAccountDashboard({ dashboard }: ClientAccountDashboardProps) {
  const { notifications, unreadCount, roomReservations, tableReservations } = dashboard;

  return (
    <div className="space-y-10">
      <section id="notifications">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-palm-deep flex items-center gap-2">
            <Bell size={20} />
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs font-sans bg-palm-deep text-linen px-2 py-0.5 rounded-full">
                {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </h2>
        </div>
        {notifications.length === 0 ? (
          <p className="text-sm text-ink/50 bg-white border border-palm-soft/50 rounded-sm p-5">
            Aucune notification pour le moment. Dès que l&apos;hôtel confirmera une réservation,
            vous verrez ici un message « Réservation confirmée » — et le bouton notifications
            apparaîtra sur le site.
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <NotificationCard key={n.id} notification={n} />
            ))}
          </div>
        )}
      </section>

      <section id="reservations-chambres">
        <h2 className="font-display text-xl text-palm-deep mb-4 flex items-center gap-2">
          <Bed size={20} />
          Mes réservations chambre
        </h2>
        {roomReservations.length === 0 ? (
          <p className="text-sm text-ink/50 bg-white border border-palm-soft/50 rounded-sm p-5">
            Aucune réservation chambre.{" "}
            <Link href="/chambres" className="text-palm-deep hover:opacity-70">
              Parcourir les chambres →
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {roomReservations.map((r) => (
              <article
                key={r.id}
                className="bg-white border border-palm-soft/50 rounded-sm p-5 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <p className="font-medium text-palm-deep">{r.roomTitle}</p>
                  <StatusPill status={r.status} />
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-ink/80">
                  <p>Arrivée : {r.checkIn}</p>
                  <p>Départ : {r.checkOut}</p>
                  {r.nights != null && <p>Nuits : {r.nights}</p>}
                  {r.totalPrice != null && (
                    <p>
                      {r.status === "confirmed" && r.paymentMethod === "on_site"
                        ? "Total à régler sur place"
                        : "Total"}
                      : {r.totalPrice} $
                    </p>
                  )}
                  {r.transactionCode && (
                    <p className="sm:col-span-2 text-xs text-ink/50">Réf. {r.transactionCode}</p>
                  )}
                </div>
                {r.status === "pending" && (
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-sm px-3 py-2 mt-3">
                    En attente de validation par l&apos;hôtel. Aucun paiement en ligne.
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="reservations-restaurant">
        <h2 className="font-display text-xl text-palm-deep mb-4 flex items-center gap-2">
          <UtensilsCrossed size={20} />
          Mes réservations restaurant
        </h2>
        {tableReservations.length === 0 ? (
          <p className="text-sm text-ink/50 bg-white border border-palm-soft/50 rounded-sm p-5">
            Aucune réservation table.{" "}
            <Link href="/restaurant" className="text-palm-deep hover:opacity-70">
              Réserver une table →
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {tableReservations.map((r) => (
              <article
                key={r.id}
                className="bg-white border border-palm-soft/50 rounded-sm p-5 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <p className="font-medium text-palm-deep">{r.tableName}</p>
                  <StatusPill status={r.status} />
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-ink/80">
                  <p>Date : {r.reservationDate}</p>
                  <p>Heure : {r.reservationTime}</p>
                  <p>Personnes : {r.partySize}</p>
                </div>
                {r.status === "pending" && (
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-sm px-3 py-2 mt-3">
                    En attente de confirmation par l&apos;hôtel.
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
