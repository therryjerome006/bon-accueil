"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Room } from "@/lib/rooms";
import { getRoomImage } from "@/lib/rooms";
import {
  calculateNights,
  calculateTotal,
  validateReservationForm,
  type ReservationFormData,
} from "@/lib/reservation";

type ReservationFormProps = {
  room: Room;
};

const INITIAL: ReservationFormData = {
  checkIn: "",
  checkOut: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

export function ReservationForm({ room }: ReservationFormProps) {
  const [form, setForm] = useState<ReservationFormData>(INITIAL);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut || form.checkOut <= form.checkIn) return 0;
    return calculateNights(form.checkIn, form.checkOut);
  }, [form.checkIn, form.checkOut]);

  const total = useMemo(() => calculateTotal(room.price, nights), [room.price, nights]);

  function updateField<K extends keyof ReservationFormData>(key: K, value: ReservationFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setGeneralError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError(null);

    const errors = validateReservationForm(form, room.price);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors as Record<string, string>);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reservations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomSlug: room.slug,
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGeneralError(data.error ?? "Une erreur est survenue. Veuillez réessayer.");
        setSubmitting(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setGeneralError("Impossible de rediriger vers le paiement.");
    } catch {
      setGeneralError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 text-sm bg-white border border-palm-soft/60 rounded-sm focus:outline-none focus:border-palm transition-colors";

  return (
    <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
      <div className="lg:col-span-2">
        <div className="relative w-full h-56 lg:h-72 rounded-sm overflow-hidden mb-5">
          <Image src={getRoomImage(room)} alt={room.title} fill className="object-cover" />
        </div>
        <h2 className="font-display text-2xl text-palm-deep mb-2">{room.title}</h2>
        <p className="text-sm text-ink/70 mb-4">
          {room.surface} m² · {room.capacity} pers. · {room.price} $ / nuit
        </p>
        <div className="bg-sand/60 rounded-sm p-5 text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-ink/70">Nuits</span>
            <span className="font-medium">{nights > 0 ? nights : "—"}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-ink/70">Tarif / nuit</span>
            <span className="font-medium">{room.price} $</span>
          </div>
          <div className="border-t border-palm-soft/50 pt-3 mt-3 flex justify-between">
            <span className="text-palm-deep font-medium">Total</span>
            <span className="font-display text-xl text-palm-deep">
              {nights > 0 ? `${total} $` : "—"}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-5" noValidate>
        <h3 className="font-display text-xl text-palm-deep">Vos informations</h3>

        {generalError && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3" role="alert">
            {generalError}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="firstName" className="block text-xs uppercase tracking-wide text-palm mb-2">
              Prénom
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className={inputClass}
            />
            {fieldErrors.firstName && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.firstName}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-xs uppercase tracking-wide text-palm mb-2">
              Nom
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className={inputClass}
            />
            {fieldErrors.lastName && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-wide text-palm mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
            />
            {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-xs uppercase tracking-wide text-palm mb-2">
              Téléphone
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass}
            />
            {fieldErrors.phone && <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="checkIn" className="block text-xs uppercase tracking-wide text-palm mb-2">
              Date d&apos;arrivée
            </label>
            <input
              id="checkIn"
              type="date"
              value={form.checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => updateField("checkIn", e.target.value)}
              className={inputClass}
            />
            {fieldErrors.checkIn && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.checkIn}</p>
            )}
          </div>
          <div>
            <label htmlFor="checkOut" className="block text-xs uppercase tracking-wide text-palm mb-2">
              Date de départ
            </label>
            <input
              id="checkOut"
              type="date"
              value={form.checkOut}
              min={form.checkIn || new Date().toISOString().split("T")[0]}
              onChange={(e) => updateField("checkOut", e.target.value)}
              className={inputClass}
            />
            {fieldErrors.checkOut && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.checkOut}</p>
            )}
          </div>
        </div>

        <p className="text-xs text-ink/50">
          Vous serez redirigé vers Stripe pour finaliser le paiement en toute sécurité.
        </p>

        <button
          type="submit"
          disabled={submitting || nights < 1}
          className="px-8 py-3.5 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {submitting ? "Redirection vers le paiement…" : `Payer ${nights > 0 ? `${total} $` : ""}`}
        </button>
      </form>
    </div>
  );
}
