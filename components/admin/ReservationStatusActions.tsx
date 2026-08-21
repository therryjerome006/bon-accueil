"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RESERVATION_STATUSES } from "@/lib/admin/navigation";

type ReservationStatusActionsProps = {
  id: string;
  type: "room" | "table";
  currentStatus: string;
};

export function ReservationStatusActions({ id, type, currentStatus }: ReservationStatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    if (status === currentStatus) return;
    setLoading(true);
    const endpoint =
      type === "room" ? `/api/admin/reservations/${id}` : `/api/admin/table-reservations/${id}`;
    await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <select
      value={currentStatus}
      disabled={loading}
      onChange={(e) => updateStatus(e.target.value)}
      className="text-xs border border-palm-soft/60 rounded-sm px-2 py-1 bg-white"
    >
      {RESERVATION_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
