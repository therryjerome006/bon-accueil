import { STATUS_LABELS } from "@/lib/admin/navigation";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  available: "bg-green-100 text-green-800 border-green-200",
  maintenance: "bg-orange-100 text-orange-800 border-orange-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs rounded-sm border ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
