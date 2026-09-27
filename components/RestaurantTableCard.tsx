import Link from "next/link";
import { AppMedia } from "@/components/AppMedia";
import { Users } from "lucide-react";
import type { RestaurantTable } from "@/lib/restaurant.types";
import { getTableImage, getTableReservationParam } from "@/lib/restaurant-utils";

type RestaurantTableCardProps = {
  table: RestaurantTable;
};

export function RestaurantTableCard({ table }: RestaurantTableCardProps) {
  return (
    <article className="group rounded-sm overflow-hidden bg-white transition-transform hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative w-full h-56">
        <AppMedia
          src={getTableImage(table)}
          alt={table.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
          playing
        />
      </div>
      <div className="p-7">
        <h3 className="font-display text-xl mb-2 text-palm-deep">{table.name}</h3>
        <p className="flex items-center gap-2 text-xs uppercase tracking-wide mb-4 text-palm">
          <Users size={14} /> Jusqu&apos;à {table.capacity} personnes
        </p>
        <p className="text-sm leading-relaxed text-ink/70 mb-6">{table.description}</p>
        <Link
          href={`/reservation/table?table=${getTableReservationParam(table)}`}
          className="inline-flex px-5 py-2.5 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors"
        >
          Réserver
        </Link>
      </div>
    </article>
  );
}
