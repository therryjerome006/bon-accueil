export type ReservationFormData = {
  checkIn: string;
  checkOut: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type ReservationErrors = Partial<Record<keyof ReservationFormData | "general", string>>;

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function calculateTotal(pricePerNight: number, nights: number): number {
  return pricePerNight * nights;
}

function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function todayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateReservationForm(
  data: ReservationFormData,
  pricePerNight: number,
): ReservationErrors {
  const errors: ReservationErrors = {};

  if (!data.firstName.trim()) errors.firstName = "Le prénom est requis.";
  if (!data.lastName.trim()) errors.lastName = "Le nom est requis.";
  if (!data.email.trim()) {
    errors.email = "L'email est requis.";
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = "Adresse email invalide.";
  }
  if (!data.phone.trim()) {
    errors.phone = "Le numéro de téléphone est requis.";
  } else if (data.phone.replace(/\D/g, "").length < 8) {
    errors.phone = "Numéro de téléphone invalide.";
  }

  if (!data.checkIn) {
    errors.checkIn = "La date d'arrivée est requise.";
  } else if (data.checkIn < todayString()) {
    errors.checkIn = "La date d'arrivée ne peut pas être dans le passé.";
  }

  if (!data.checkOut) {
    errors.checkOut = "La date de départ est requise.";
  } else if (data.checkIn && data.checkOut <= data.checkIn) {
    errors.checkOut = "La date de départ doit être après l'arrivée.";
  }

  if (data.checkIn && data.checkOut && data.checkOut > data.checkIn) {
    const nights = calculateNights(data.checkIn, data.checkOut);
    if (nights < 1) errors.checkOut = "Le séjour doit comporter au moins une nuit.";
    if (nights > 30) errors.checkOut = "Pour un séjour de plus de 30 nuits, contactez-nous directement.";
    if (pricePerNight <= 0) errors.general = "Tarif de la chambre invalide.";
  }

  return errors;
}

export function formatDateFr(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}
