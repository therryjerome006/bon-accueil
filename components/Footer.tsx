import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-palm-deep text-palm-soft pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid sm:grid-cols-2 md:grid-cols-5 gap-10 mb-14">
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-xl text-linen">Bon Accueil</span>
          <p className="text-xs mt-3 leading-relaxed">Hôtel · Jacmel, Haïti</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wide mb-4 text-sand">Compte</h4>
          <Link href="/login" className="block text-sm mb-2 hover:opacity-70">
            Log in
          </Link>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wide mb-4 text-sand">Adresse</h4>
          <p className="text-sm mb-2">Rue du Commerce, Jacmel</p>
          <p className="text-sm">+509 00 00 0000</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wide mb-4 text-sand">Liens</h4>
          <Link href="/chambres" className="block text-sm mb-2 hover:opacity-70">
            Chambres
          </Link>
          <Link href="/services" className="block text-sm hover:opacity-70">
            Services
          </Link>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wide mb-4 text-sand">Réseaux</h4>
          <a href="#" className="block text-sm mb-2 hover:opacity-70">
            Instagram
          </a>
          <a href="#" className="block text-sm hover:opacity-70">
            Facebook
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-palm-soft">
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
    </footer>
  );
}
