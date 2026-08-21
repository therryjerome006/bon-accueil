import { Suspense } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getAllReservations } from "@/lib/admin/stats";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ReservationStatusActions } from "@/components/admin/ReservationStatusActions";
import { ReservationFilters } from "@/components/admin/AdminFilters";
import {
  GuestManualEmailLink,
  ReservationAudienceBadge,
} from "@/components/admin/GuestManualEmailLink";

export const metadata: Metadata = {
  title: "Réservations — Admin Bon Accueil",
};

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminReservationsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const { status } = await searchParams;
  const { rooms, tables } = await getAllReservations(status);

  return (
    <div>
      <h1 className="font-display text-3xl text-palm-deep mb-6">Boîte de réception</h1>

      <Suspense fallback={null}>
        <ReservationFilters />
      </Suspense>

      <section className="mb-10">
        <h2 className="font-display text-xl text-palm-deep mb-4">Chambres ({rooms.length})</h2>
        {rooms.length === 0 ? (
          <p className="text-sm text-ink/50">Aucune réservation chambre.</p>
        ) : (
          <div className="overflow-x-auto border border-palm-soft/50 rounded-sm bg-white">
            <table className="w-full text-sm">
              <thead className="bg-sand/40 text-left text-xs uppercase tracking-wide text-ink/60">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Chambre</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => {
                  const hasAccount = Boolean(r.user_id);
                  return (
                  <tr key={r.id} className="border-t border-palm-soft/30">
                    <td className="px-4 py-3">
                      <div>{r.first_name} {r.last_name}</div>
                      <div className="text-xs text-ink/50">{r.email}</div>
                      {!hasAccount && r.status !== "pending" && (
                        <p className="text-[10px] text-amber-800 mt-1">Confirmer par email hôtel</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ReservationAudienceBadge hasAccount={hasAccount} />
                    </td>
                    <td className="px-4 py-3">{r.label}</td>
                    <td className="px-4 py-3 text-xs">
                      {r.check_in} → {r.check_out}
                      {r.nights != null && <span className="block text-ink/50">{r.nights} nuits</span>}
                    </td>
                    <td className="px-4 py-3">{r.total_price != null ? `${r.total_price} $` : "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <ReservationStatusActions id={r.id} type="room" currentStatus={r.status} />
                      <GuestManualEmailLink
                        type="room"
                        status={r.status}
                        email={r.email}
                        firstName={r.first_name}
                        lastName={r.last_name}
                        hasAccount={hasAccount}
                        room={{
                          title: r.label,
                          checkIn: r.check_in,
                          checkOut: r.check_out,
                          transactionCode: r.transaction_code,
                          totalPrice: r.total_price,
                        }}
                      />
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl text-palm-deep mb-4">Restaurant ({tables.length})</h2>
        {tables.length === 0 ? (
          <p className="text-sm text-ink/50">Aucune réservation table.</p>
        ) : (
          <div className="overflow-x-auto border border-palm-soft/50 rounded-sm bg-white">
            <table className="w-full text-sm">
              <thead className="bg-sand/40 text-left text-xs uppercase tracking-wide text-ink/60">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Table</th>
                  <th className="px-4 py-3">Date / heure</th>
                  <th className="px-4 py-3">Pers.</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((r) => {
                  const hasAccount = Boolean(r.user_id);
                  return (
                  <tr key={r.id} className="border-t border-palm-soft/30">
                    <td className="px-4 py-3">
                      <div>{r.first_name} {r.last_name}</div>
                      <div className="text-xs text-ink/50">{r.email} · {r.phone}</div>
                      {!hasAccount && r.status !== "pending" && (
                        <p className="text-[10px] text-amber-800 mt-1">Confirmer par email hôtel</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ReservationAudienceBadge hasAccount={hasAccount} />
                    </td>
                    <td className="px-4 py-3">{r.label}</td>
                    <td className="px-4 py-3">{r.reservation_date} · {r.reservation_time}</td>
                    <td className="px-4 py-3">{r.party_size}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <ReservationStatusActions id={r.id} type="table" currentStatus={r.status} />
                      <GuestManualEmailLink
                        type="table"
                        status={r.status}
                        email={r.email}
                        firstName={r.first_name}
                        lastName={r.last_name}
                        hasAccount={hasAccount}
                        table={{
                          name: r.label,
                          reservationDate: r.reservation_date,
                          reservationTime: r.reservation_time,
                          partySize: r.party_size,
                        }}
                      />
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
