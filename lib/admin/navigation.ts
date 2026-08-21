import {
  LayoutDashboard,
  Calendar,
  Bed,
  UtensilsCrossed,
  Compass,
  BarChart3,
} from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/reservations", label: "Réservations", icon: Calendar },
  { href: "/admin/chambres", label: "Chambres", icon: Bed },
  { href: "/admin/restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { href: "/admin/activites", label: "Groupes & événements", icon: Compass },
  { href: "/admin/stats", label: "Statistiques", icon: BarChart3 },
] as const;

export const RESERVATION_STATUSES = ["pending", "confirmed", "rejected", "cancelled"] as const;
export const ITEM_STATUSES = ["available", "maintenance", "inactive"] as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  rejected: "Refusée",
  cancelled: "Annulée",
  available: "Disponible",
  maintenance: "Maintenance",
  inactive: "Inactive",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
