"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AppImage } from "@/components/AppImage";
import { ITEM_STATUSES } from "@/lib/admin/navigation";
import { firstImageUrl, parseImageUrls } from "@/lib/image-url";
import { SITE_IMAGES } from "@/lib/site-images";
import type { Tables } from "@/types/database.types";

type RestaurantTable = Tables<"restaurant_tables">;

type AdminTableFormProps = {
  table?: RestaurantTable;
};

export function AdminTableForm({ table }: AdminTableFormProps) {
  const router = useRouter();
  const isEdit = Boolean(table);

  const [name, setName] = useState(table?.name ?? "");
  const [capacity, setCapacity] = useState(String(table?.capacity ?? 2));
  const [description, setDescription] = useState(table?.description ?? "");
  const [images, setImages] = useState((table?.images ?? []).join("\n"));
  const [status, setStatus] = useState(table?.status ?? "available");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewImage = useMemo(
    () => firstImageUrl(parseImageUrls(images), SITE_IMAGES.restaurant.fallback),
    [images],
  );

  const inputClass =
    "w-full px-3 py-2 text-sm border border-palm-soft/60 rounded-sm focus:outline-none focus:border-palm";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { name, capacity: Number(capacity), description, images, status };
    const url = isEdit ? `/api/admin/restaurant-tables/${table!.id}` : "/api/admin/restaurant-tables";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Erreur");
      setLoading(false);
      return;
    }

    router.push("/admin/restaurant");
    router.refresh();
  }

  async function handleDelete() {
    if (!table || !confirm("Supprimer cette table ?")) return;
    await fetch(`/api/admin/restaurant-tables/${table.id}`, { method: "DELETE" });
    router.push("/admin/restaurant");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-5">
      {error && <p className="text-sm text-red-700 bg-red-50 px-4 py-2 rounded-sm">{error}</p>}

      <div>
        <label className="block text-xs uppercase text-palm mb-1">Nom</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase text-palm mb-1">Capacité</label>
          <input required type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase text-palm mb-1">Statut</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={inputClass}>
            {ITEM_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase text-palm mb-1">Description</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="block text-xs uppercase text-palm mb-1">Images (une URL par ligne)</label>
        <p className="text-xs text-ink/50 mb-2">
          Chemin local (<code className="text-[11px]">/images/…</code>) ou URL publique complète (
          <code className="text-[11px]">https://…</code>).
        </p>
        <textarea rows={3} value={images} onChange={(e) => setImages(e.target.value)} className={inputClass} />
        <div className="relative w-full h-40 mt-3 rounded-sm overflow-hidden bg-sand/40">
          <AppImage src={previewImage} alt="Aperçu" fill sizes="400px" className="object-cover" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm bg-palm-deep text-linen rounded-sm hover:bg-palm disabled:opacity-50">
          {loading ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer la table"}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className="px-6 py-2.5 text-sm border border-red-300 text-red-700 rounded-sm hover:bg-red-50">
            Supprimer
          </button>
        )}
      </div>
    </form>
  );
}
