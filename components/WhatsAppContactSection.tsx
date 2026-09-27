"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { getContactPhone } from "@/lib/env";

const DEFAULT_MESSAGE =
  "Bonjour Bon Accueil Hotel,\n\nJe souhaite des informations concernant :\n\n(Merci de préciser dates, nombre de personnes, chambre ou événement.)";

type WhatsAppContactSectionProps = {
  className?: string;
};

export function WhatsAppContactSection({ className = "" }: WhatsAppContactSectionProps) {
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const whatsappHref = useMemo(() => getWhatsAppUrl(message), [message]);
  const phone = getContactPhone();

  return (
    <section id="whatsapp" className={`py-20 md:py-28 bg-linen ${className}`}>
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <div className="text-center mb-10">
          <Eyebrow>Nous écrire</Eyebrow>
          <h2 className="font-display text-3xl md:text-4xl text-palm-deep mb-4">Message direct à l&apos;hôtel</h2>
          <p className="text-sm md:text-base text-ink/75 leading-relaxed max-w-xl mx-auto">
            Rédigez votre message ci-dessous, puis ouvrez WhatsApp pour l&apos;envoyer à notre équipe au{" "}
            <span className="text-palm-deep font-medium">{phone}</span>.
          </p>
        </div>

        <div className="rounded-sm border border-palm-soft/50 bg-white p-6 md:p-8 shadow-sm">
          <label htmlFor="whatsapp-message" className="block text-xs uppercase tracking-wide text-palm mb-2">
            Votre message
          </label>
          <textarea
            id="whatsapp-message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-3 text-sm border border-palm-soft/60 rounded-sm focus:outline-none focus:border-palm focus:ring-2 focus:ring-palm/20 resize-y min-h-[140px] text-ink"
            placeholder="Bonjour, je voudrais réserver une chambre…"
          />

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-sm bg-[#25D366] text-white hover:bg-[#1fb855] transition-colors"
            >
              <MessageCircle size={20} aria-hidden />
              Envoyer sur WhatsApp
            </a>
            <p className="text-xs text-ink/55 sm:flex-1">
              WhatsApp s&apos;ouvre sur votre téléphone ou votre ordinateur. Vous pourrez relire le message avant
              l&apos;envoi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
