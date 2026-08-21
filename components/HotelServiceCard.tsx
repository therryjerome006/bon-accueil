import { ChefHat, Waves, Building2, UtensilsCrossed, Headphones } from "lucide-react";
import type { HotelEventService } from "@/lib/group-events";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<HotelEventService["icon"], LucideIcon> = {
  catering: ChefHat,
  pool: Waves,
  room: Building2,
  restaurant: UtensilsCrossed,
  coordination: Headphones,
};

type HotelServiceCardProps = {
  service: HotelEventService;
};

export function HotelServiceCard({ service }: HotelServiceCardProps) {
  const Icon = ICONS[service.icon];

  return (
    <article className="rounded-sm bg-white p-7 border border-palm-soft/30 h-full">
      <Icon size={24} className="text-palm mb-4" aria-hidden />
      <h3 className="font-display text-lg mb-3 text-palm-deep">{service.title}</h3>
      <p className="text-sm leading-relaxed text-ink/70">{service.description}</p>
    </article>
  );
}
