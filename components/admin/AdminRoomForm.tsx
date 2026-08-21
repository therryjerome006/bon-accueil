"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AMENITY_LABELS, SERVICE_LABELS } from "@/lib/rooms";
import { ITEM_STATUSES, slugify } from "@/lib/admin/navigation";
import type { Tables } from "@/types/database.types";

type Room = Tables<"rooms">;

type AdminRoomFormProps = {
  room?: Room;
};

export function AdminRoomForm({ room }: AdminRoomFormProps) {
  const router = useRouter();
  const isEdit = Boolean(room);

  const [title, setTitle] = useState(room?.title ?? "");
  const [slug, setSlug] = useState(room?.slug ?? "");
  const [price, setPrice] = useState(String(room?.price ?? ""));
  const [capacity, setCapacity] = useState(String(room?.capacity ?? 2));
  const [surface, setSurface] = useState(String(room?.surface ?? ""));
  const [description, setDescription] = useState(room?.description ?? "");
  const [images, setImages] = useState((room?.images ?? []).join("\n"));
  const [amenities, setAmenities] = useState<string[]>(room?.amenities ?? []);
  const [services, setServices] = useState<string[]>(room?.services ?? []);
  const [isFeatured, setIsFeatured] = useState(room?.is_featured ?? false);
  const [status, setStatus] = useState(room?.status ?? "available");
  const [roomType, setRoomType] = useState(room?.room_type ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full px-3 py-2 text-sm border border-palm-soft/60 rounded-sm focus:outline-none focus:border-palm";

  function toggleItem(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      slug: slug || slugify(title),
      price: Number(price),
      capacity: Number(capacity),
      surface: Number(surface) || null,
      description,
      images,
      amenities,
      services,
      is_featured: isFeatured,
      status,
      room_type: roomType,
    };

    const url = isEdit ? `/api/admin/rooms/${room!.id}` : "/api/admin/rooms";
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

    router.push("/admin/chambres");
    router.refresh();
  }

  async function handleDelete() {
    if (!room || !confirm("Supprimer cette chambre ?")) return;
    await fetch(`/api/admin/rooms/${room.id}`, { method: "DELETE" });
    router.push("/admin/chambres");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-5">
      {error && <p className="text-sm text-red-700 bg-red-50 px-4 py-2 rounded-sm">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase text-palm mb-1">Titre</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase text-palm mb-1">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(title)} className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs uppercase text-palm mb-1">Prix ($/nuit)</label>
          <input required type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase text-palm mb-1">Capacité</label>
          <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase text-palm mb-1">Surface (m²)</label>
          <input type="number" min={0} value={surface} onChange={(e) => setSurface(e.target.value)} className={inputClass} />
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

      <div>
        <p className="text-xs uppercase text-palm mb-2">Équipements</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {AMENITY_LABELS.map((a) => (
            <label key={a} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleItem(amenities, setAmenities, a)} />
              {a}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase text-palm mb-2">Services</p>
        <div className="flex flex-col gap-2">
          {SERVICE_LABELS.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={services.includes(s)} onChange={() => toggleItem(services, setServices, s)} />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase text-palm mb-1">Statut</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={inputClass}>
            {ITEM_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase text-palm mb-1">Type de chambre</label>
          <input value={roomType} onChange={(e) => setRoomType(e.target.value)} className={inputClass} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
        Afficher sur la page d&apos;accueil
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm bg-palm-deep text-linen rounded-sm hover:bg-palm disabled:opacity-50">
          {loading ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer la chambre"}
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
