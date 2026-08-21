import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClientAccountDashboard } from "@/components/ClientAccountDashboard";
import { requireUser, getProfile } from "@/lib/auth";
import { getClientDashboard } from "@/lib/account";

export const metadata: Metadata = {
  title: "Mon compte — Bon Accueil Hotel",
  description: "Votre espace personnel Bon Accueil Hotel — réservations et notifications.",
};

export default async function ComptePage() {
  const user = await requireUser();
  const profile = await getProfile();
  const dashboard = await getClientDashboard(user.id, user.email ?? "");

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="font-display text-3xl text-palm-deep mb-2">Mon compte</h1>
          <p className="text-sm text-ink/70 mb-8">
            Bienvenue{profile?.first_name ? `, ${profile.first_name}` : ""}. Vos réservations et
            confirmations de l&apos;hôtel apparaissent ici — <strong>sans email</strong>, directement
            dans votre boîte de notifications.
          </p>

          <div className="bg-white border border-palm-soft/50 rounded-sm p-6 mb-10 text-sm">
            <div className="flex justify-between py-2 border-b border-palm-soft/30">
              <span className="text-ink/60">Email</span>
              <span>{profile?.email ?? user.email}</span>
            </div>
            {(profile?.first_name || profile?.last_name) && (
              <div className="flex justify-between py-2">
                <span className="text-ink/60">Nom</span>
                <span>
                  {profile?.first_name} {profile?.last_name}
                </span>
              </div>
            )}
          </div>

          <ClientAccountDashboard dashboard={dashboard} userName={profile?.first_name} />

          <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-palm-soft/40">
            <Link
              href="/chambres"
              className="px-6 py-3 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors"
            >
              Réserver une chambre
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="px-6 py-3 text-sm tracking-wide border border-palm-deep text-palm-deep rounded-sm hover:bg-sand/40 transition-colors"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
