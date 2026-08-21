import { hasStripe } from "@/lib/stripe";

export type PaymentMode = "on_site" | "stripe";

/**
 * Mode de paiement des réservations chambre.
 * - `on_site` (défaut) : réservation confirmée, paiement à l'arrivée
 * - `stripe` : redirection Stripe Checkout (nécessite les clés Stripe)
 *
 * Pour réactiver Stripe plus tard : PAYMENT_MODE=stripe + clés Stripe dans .env
 */
export function getPaymentMode(): PaymentMode {
  const raw =
    process.env.PAYMENT_MODE ?? process.env.NEXT_PUBLIC_PAYMENT_MODE ?? "on_site";
  return raw === "stripe" ? "stripe" : "on_site";
}

/** Stripe Checkout actif (mode stripe + clés configurées). */
export function isStripeCheckoutEnabled(): boolean {
  return getPaymentMode() === "stripe" && hasStripe();
}

/** Réservation en ligne sans paiement carte — paiement sur place. */
export function isOnSitePaymentMode(): boolean {
  return !isStripeCheckoutEnabled();
}

export function reservationReferenceFromId(id: string): string {
  return `BA-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
