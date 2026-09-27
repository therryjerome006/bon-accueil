import Link from "next/link";
import { getContactEmail, getContactPhone } from "@/lib/env";
import { getHotelAddressShort, getHotelPhoneTel, HOTEL_CITY, HOTEL_SETTING } from "@/lib/hotel";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const phone = getContactPhone();
  const email = getContactEmail();
  const address = getHotelAddressShort();

  return (
    <footer className="bg-palm-deep text-palm-soft pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid sm:grid-cols-2 md:grid-cols-5 gap-10 mb-14">
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-xl text-linen">Bon Accueil</span>
          <p className="text-xs mt-3 leading-relaxed">
            Hôtel · {HOTEL_CITY}
            <br />
            {HOTEL_SETTING}
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wide mb-4 text-sand">Compte</h4>
          <Link href="/login" className="block text-sm mb-2 hover:opacity-70">
            Log in
          </Link>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wide mb-4 text-sand">Adresse</h4>
          <p className="text-sm mb-2 leading-relaxed">{address}</p>
          <a href={`tel:${getHotelPhoneTel()}`} className="text-sm block mb-2 hover:opacity-70">
            {phone}
          </a>
          <a href={`mailto:${email}`} className="text-sm hover:opacity-70">
            {email}
          </a>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wide mb-4 text-sand">Liens</h4>
          <Link href="/chambres" className="block text-sm mb-2 hover:opacity-70">
            Chambres
          </Link>
          <Link href="/services" className="block text-sm mb-2 hover:opacity-70">
            Services
          </Link>
          <Link href="/contact" className="block text-sm hover:opacity-70">
            Contact
          </Link>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wide mb-4 text-sand">Réseaux</h4>
          <a
            href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "#"}
            className="block text-sm mb-2 hover:opacity-70"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href={process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "#"}
            className="block text-sm mb-2 hover:opacity-70"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href={getWhatsAppUrl()}
            className="block text-sm hover:opacity-70"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 border-t border-white/10 space-y-3 text-xs text-palm-soft">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <span>© 2026 Bon Accueil Hotel — Tous droits réservés</span>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:opacity-70">
              Mentions légales
            </Link>
            <Link href="/partenaires" className="hover:opacity-70">
              Partenaires
            </Link>
          </div>
        </div>
        <p className="text-palm-soft/80">
          Site développé par{" "}
          <span className="text-sand/90">Therry Adler Jerome</span>, développeur d&apos;applications web
          modernes.
        </p>
      </div>
    </footer>
  );
}
