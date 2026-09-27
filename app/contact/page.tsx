import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { WhatsAppContactSection } from "@/components/WhatsAppContactSection";
import { getContactEmail, getContactPhone } from "@/lib/env";
import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsLink,
  getHotelAddress,
  getHotelPhoneTel,
} from "@/lib/hotel";

export const metadata: Metadata = {
  title: "Contact — Bon Accueil Hotel",
  description:
    "Téléphone, email, adresse et message WhatsApp — contactez Bon Accueil Hotel aux hauteurs de Jacmel.",
};

export default function ContactPage() {
  const phone = getContactPhone();
  const email = getContactEmail();
  const address = getHotelAddress();

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <PageHero
          eyebrow="Bon Accueil"
          title="Nous contacter"
          description="Notre équipe répond par téléphone, email ou WhatsApp pour vos réservations, événements et questions."
        />

        <section className="max-w-3xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <ul className="space-y-6 text-sm md:text-base">
            <li className="flex items-start gap-4">
              <Phone size={20} className="text-palm shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-wide text-palm mb-1">Téléphone</p>
                <a href={`tel:${getHotelPhoneTel()}`} className="text-palm-deep hover:opacity-70">
                  {phone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <Mail size={20} className="text-palm shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-wide text-palm mb-1">Email</p>
                <a href={`mailto:${email}`} className="text-palm-deep hover:opacity-70">
                  {email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <MapPin size={20} className="text-palm shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-wide text-palm mb-1">Adresse</p>
                <a
                  href={getGoogleMapsLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-palm-deep hover:opacity-70 leading-relaxed"
                >
                  {address}
                </a>
              </div>
            </li>
          </ul>
        </section>

        <WhatsAppContactSection className="pt-0" />

        <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
          <iframe
            title="Localisation Bon Accueil Hotel"
            src={getGoogleMapsEmbedUrl()}
            className="w-full h-72 md:h-96 rounded-sm border border-palm-soft/40"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
