import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { getContactEmail, getContactPhone } from "@/lib/env";
import { getHotelAddress } from "@/lib/hotel";

export const metadata: Metadata = {
  title: "Mentions légales — Bon Accueil Hotel",
};

export default function MentionsLegalesPage() {
  const email = getContactEmail();
  const phone = getContactPhone();
  const address = getHotelAddress();

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <PageHero eyebrow="Informations légales" title="Mentions légales" />
        <section className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-ink/80 space-y-6">
          <div>
            <h2 className="font-display text-xl text-palm-deep mb-2">Éditeur du site</h2>
            <p>
              Bon Accueil Hotel
              <br />
              {address}
              <br />
              {email}
              <br />
              {phone}
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-palm-deep mb-2">Réalisation du site</h2>
            <p>
              Conception et développement : <strong>Therry Adler Jerome</strong>, développeur
              d&apos;applications web modernes.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-palm-deep mb-2">Hébergement</h2>
            <p>
              Le site est hébergé par Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-palm-deep mb-2">Données personnelles</h2>
            <p>
              Les données collectées lors des réservations (nom, email, téléphone) sont utilisées
              uniquement pour la gestion de votre séjour. Vous pouvez demander leur suppression en
              contactant {email}.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-palm-deep mb-2">Paiements</h2>
            <p>
              Les réservations de chambre peuvent être confirmées en ligne sans paiement par carte :
              le règlement s&apos;effectue directement à l&apos;hôtel, à l&apos;arrivée ou selon les
              modalités convenues avec l&apos;établissement. Lorsque le paiement en ligne par carte
              sera disponible, il pourra être traité de manière sécurisée via Stripe. Bon Accueil
              Hotel ne stocke pas vos informations bancaires.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
