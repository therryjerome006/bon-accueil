"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppImage } from "@/components/AppImage";
import { Users } from "lucide-react";
import type { RestaurantTable } from "@/lib/restaurant";
import { getTableImage, getTableReservationParam } from "@/lib/restaurant";

type TableReservationFormProps = {
  table: RestaurantTable;
  isLoggedIn: boolean;
  accountEmail?: string | null;
};

type FormData = {
  reservationDate: string;
  reservationTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  partySize: string;
};

const INITIAL: FormData = {
  reservationDate: "",
  reservationTime: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  partySize: "2",
};

export function TableReservationForm({ table, isLoggedIn, accountEmail }: TableReservationFormProps) {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successGuest, setSuccessGuest] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (accountEmail) {
      setForm((prev) => ({ ...prev, email: accountEmail }));
    }
  }, [accountEmail]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setGeneralError(null);
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    const today = new Date().toISOString().split("T")[0];

    if (!form.firstName.trim()) e.firstName = "Le prénom est requis.";
    if (!form.lastName.trim()) e.lastName = "Le nom est requis.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Adresse email invalide.";
    }
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 8) {
      e.phone = "Numéro de téléphone invalide.";
    }
    if (!form.reservationDate) e.reservationDate = "La date est requise.";
    else if (form.reservationDate < today) e.reservationDate = "La date ne peut pas être dans le passé.";
    if (!form.reservationTime) e.reservationTime = "L'heure est requise.";

    const size = parseInt(form.partySize, 10);
    if (!size || size < 1) e.partySize = "Nombre de personnes invalide.";
    else if (size > table.capacity) {
      e.partySize = `Cette table accueille maximum ${table.capacity} personnes.`;
    }

    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setGeneralError(null);

    try {
      const res = await fetch("/api/reservations/table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableSlug: getTableReservationParam(table),
          reservationDate: form.reservationDate,
          reservationTime: form.reservationTime,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          partySize: parseInt(form.partySize, 10),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setGeneralError(data.error ?? "Une erreur est survenue.");
        return;
      }

      setSuccess(true);
      setSuccessGuest(!data.hasAccount);
    } catch {
      setGeneralError("Connexion impossible. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 text-sm bg-white border border-palm-soft/60 rounded-sm focus:outline-none focus:border-palm transition-colors";

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <h2 className="font-display text-2xl text-palm-deep mb-4">Demande envoyée</h2>
        <p className="text-ink/70">
          Votre demande pour <strong>{table.name}</strong> a été enregistrée.
          {successGuest ? (
            <> L&apos;hôtel vous enverra la confirmation par <strong>email</strong> (depuis leur messagerie, pas le site).</>
          ) : (
            <> Suivez la réponse dans votre <Link href="/compte" className="text-palm-deep underline">espace client</Link>.</>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
      <div className="lg:col-span-2">
        <div className="relative w-full h-56 lg:h-72 rounded-sm overflow-hidden mb-5">
          <AppImage src={getTableImage(table)} alt={table.name} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
        </div>
        <h2 className="font-display text-2xl text-palm-deep mb-2">{table.name}</h2>
        <p className="flex items-center gap-2 text-sm text-palm mb-3">
          <Users size={15} /> Jusqu&apos;à {table.capacity} personnes
        </p>
        <p className="text-sm text-ink/70">{table.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-5" noValidate>
        <h3 className="font-display text-xl text-palm-deep">Réserver une table</h3>

        {generalError && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3" role="alert">
            {generalError}
          </p>
        )}

        {isLoggedIn ? (
          <div className="text-sm text-palm-deep bg-palm-soft/20 border border-palm-soft/60 rounded-sm px-4 py-3 leading-relaxed">
            Compte connecté — confirmation sur le site dans{" "}
            <Link href="/compte" className="underline">
              Mon compte
            </Link>
            .
          </div>
        ) : (
          <div className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-sm px-4 py-3 leading-relaxed">
            Sans compte : confirmation par <strong>email de l&apos;hôtel</strong>.{" "}
            <Link href="/login" className="text-palm-deep underline">
              Se connecter
            </Link>{" "}
            pour les notifications sur le site.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="firstName" className="block text-xs uppercase tracking-wide text-palm mb-2">Prénom</label>
            <input id="firstName" type="text" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} className={inputClass} />
            {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-xs uppercase tracking-wide text-palm mb-2">Nom</label>
            <input id="lastName" type="text" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} className={inputClass} />
            {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-wide text-palm mb-2">Email</label>
            <input id="email" type="email" value={form.email} readOnly={isLoggedIn && Boolean(accountEmail)} onChange={(e) => updateField("email", e.target.value)} className={`${inputClass}${isLoggedIn && accountEmail ? " bg-sand/40" : ""}`} />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-xs uppercase tracking-wide text-palm mb-2">Téléphone</label>
            <input id="phone" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} />
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="reservationDate" className="block text-xs uppercase tracking-wide text-palm mb-2">Date</label>
            <input id="reservationDate" type="date" min={new Date().toISOString().split("T")[0]} value={form.reservationDate} onChange={(e) => updateField("reservationDate", e.target.value)} className={inputClass} />
            {errors.reservationDate && <p className="text-xs text-red-600 mt-1">{errors.reservationDate}</p>}
          </div>
          <div>
            <label htmlFor="reservationTime" className="block text-xs uppercase tracking-wide text-palm mb-2">Heure</label>
            <input id="reservationTime" type="time" value={form.reservationTime} onChange={(e) => updateField("reservationTime", e.target.value)} className={inputClass} />
            {errors.reservationTime && <p className="text-xs text-red-600 mt-1">{errors.reservationTime}</p>}
          </div>
          <div>
            <label htmlFor="partySize" className="block text-xs uppercase tracking-wide text-palm mb-2">Personnes</label>
            <select id="partySize" value={form.partySize} onChange={(e) => updateField("partySize", e.target.value)} className={inputClass}>
              {Array.from({ length: table.capacity }, (_, i) => i + 1).map((n) => (
                <option key={n} value={String(n)}>{n}</option>
              ))}
            </select>
            {errors.partySize && <p className="text-xs text-red-600 mt-1">{errors.partySize}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3.5 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {submitting ? "Envoi en cours…" : "Envoyer ma demande"}
        </button>
      </form>
    </div>
  );
}
