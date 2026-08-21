"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Tables } from "@/types/database.types";

type Activity = Tables<"activities">;

type AdminActivityFormProps = {
  activity?: Activity;
};

export function AdminActivityForm({ activity }: AdminActivityFormProps) {
  const router = useRouter();
  const isEdit = Boolean(activity);

  const [title, setTitle] = useState(activity?.title ?? "");
  const [date, setDate] = useState(activity?.date ?? "");
  const [price, setPrice] = useState(String(activity?.price ?? ""));
  const [description, setDescription] = useState(activity?.description ?? "");
  const [images, setImages] = useState((activity?.images ?? []).join("\n"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full px-3 py-2 text-sm border border-palm-soft/60 rounded-sm focus:outline-none focus:border-palm";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { title, date, price: Number(price), description, images };
    const url = isEdit ? `/api/admin/activities/${activity!.id}` : "/api/admin/activities";
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

    router.push("/admin/activites");
    router.refresh();
  }

  async function handleDelete() {
    if (!activity || !confirm("Supprimer cette activité ?")) return;
    await fetch(`/api/admin/activities/${activity.id}`, { method: "DELETE" });
    router.push("/admin/activites");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-5">
      {error && <p className="text-sm text-red-700 bg-red-50 px-4 py-2 rounded-sm">{error}</p>}

      <div>
        <label className="block text-xs uppercase text-palm mb-1">Titre</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase text-palm mb-1">Date</label>
          <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase text-palm mb-1">Prix ($)</label>
          <input required type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase text-palm mb-1">Description</label>
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="block text-xs uppercase text-palm mb-1">Images (une URL par ligne)</label>
        <textarea rows={3} value={images} onChange={(e) => setImages(e.target.value)} className={inputClass} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm bg-palm-deep text-linen rounded-sm hover:bg-palm disabled:opacity-50">
          {loading ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer l'activité"}
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
