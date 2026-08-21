"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const FILTERS = [
  { value: "all", label: "Toutes" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmées" },
  { value: "rejected", label: "Refusées" },
  { value: "cancelled", label: "Annulées" },
];

export function ReservationFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const current = searchParams.get("status") ?? "all";

  function setFilter(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") params.delete("status");
    else params.set("status", status);
    router.push(`/admin/reservations?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setFilter(value)}
          className={`px-4 py-2 text-xs tracking-wide rounded-sm transition-colors ${
            current === value
              ? "bg-palm-deep text-linen"
              : "bg-white border border-palm-soft/60 text-ink/70 hover:bg-sand/40"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function StatsPeriodTabs({ current }: { current: string }) {
  const periods = [
    { value: "month", label: "Mois" },
    { value: "quarter", label: "Trimestre" },
    { value: "semester", label: "Semestre" },
  ];

  return (
    <div className="flex gap-2 mb-8">
      {periods.map(({ value, label }) => (
        <Link
          key={value}
          href={`/admin/stats?period=${value}`}
          className={`px-4 py-2 text-xs tracking-wide rounded-sm transition-colors ${
            current === value
              ? "bg-palm-deep text-linen"
              : "bg-white border border-palm-soft/60 text-ink/70 hover:bg-sand/40"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
