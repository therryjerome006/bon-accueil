"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppImage } from "@/components/AppImage";
import type { Room } from "@/lib/rooms.types";
import { getRoomImage } from "@/lib/room-utils";
import {
  calculateNights,
  calculateTotal,
  validateReservationForm,
  type ReservationFormData,
} from "@/lib/reservation";

type ReservationFormProps = {
  room: Room;
  stripeCheckout: boolean;
  isLoggedIn: boolean;
  accountEmail?: string | null;
};

const INITIAL: ReservationFormData = {
  checkIn: "",
  checkOut: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

export function ReservationForm({ room, stripeCheckout, isLoggedIn, accountEmail }: ReservationFormProps) {
  const [form, setForm] = useState<ReservationFormData>(INITIAL);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut || form.checkOut <= form.checkIn) return 0;
    return calculateNights(form.checkIn, form.checkOut);
  }, [form.checkIn, form.checkOut]);

  const total = useMemo(() => calculateTotal(room.price, nights), [room.price, nights]);

  useEffect(() => {
    if (accountEmail) {
      setForm((prev) => ({ ...prev, email: accountEmail }));
    }
  }, [accountEmail]);

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

      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
        return;
      }

      setGeneralError("Impossible de finaliser la réservation.");
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
          <AppImage src={getRoomImage(room)} alt={room.title} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
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
            <span className="text-palm-deep font-medium">
              {stripeCheckout ? "Total" : "Total indicatif"}
            </span>
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

        {isLoggedIn ? (
          <div className="text-sm text-palm-deep bg-palm-soft/20 border border-palm-soft/60 rounded-sm px-4 py-3 leading-relaxed">
            <strong>Compte connecté.</strong> Vous recevrez la confirmation dans votre{" "}
            <Link href="/compte" className="underline hover:opacity-70">
              espace client
            </Link>{" "}
            (notifications sur le site). Aucun email automatique ne sera envoyé par le site.
          </div>
        ) : (
          <div className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-sm px-4 py-3 leading-relaxed">
            <strong>Sans compte :</strong> votre demande sera examinée par l&apos;hôtel. La confirmation
            vous sera envoyée <strong>par email directement par l&apos;hôtel</strong> (pas par le site).{" "}
            <Link href="/login" className="text-palm-deep underline hover:opacity-70">
              Connectez-vous
            </Link>{" "}
            pour suivre votre réservation sur le site.
          </div>
        )}

        {!stripeCheckout && isLoggedIn && (
          <div className="text-sm text-ink/70 border border-palm-soft/40 rounded-sm px-4 py-3 leading-relaxed">
            Paiement sur place à l&apos;arrivée — aucun débit en ligne.
          </div>
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
              readOnly={isLoggedIn && Boolean(accountEmail)}
              onChange={(e) => updateField("email", e.target.value)}
              className={`${inputClass}${isLoggedIn && accountEmail ? " bg-sand/40" : ""}`}
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

        {stripeCheckout ? (
          <p className="text-xs text-ink/50">
            Vous serez redirigé vers Stripe pour finaliser le paiement en toute sécurité.
          </p>
        ) : (
          <p className="text-xs text-ink/50">
            {isLoggedIn
              ? "La confirmation apparaîtra dans Mon compte dès validation par l'hôtel."
              : "L'hôtel vous contactera par email une fois votre demande traitée."}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || nights < 1}
          className="px-8 py-3.5 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {submitting
            ? stripeCheckout
              ? "Redirection vers le paiement…"
              : "Confirmation en cours…"
            : stripeCheckout
              ? `Payer ${nights > 0 ? `${total} $` : ""}`
              : "Envoyer ma demande"}
        </button>
      </form>
    </div>
  );
}
