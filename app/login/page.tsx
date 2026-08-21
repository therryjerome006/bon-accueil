import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Connexion — Bon Accueil Hotel",
  description: "Connectez-vous à votre compte Bon Accueil Hotel.",
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl text-palm-deep mb-3">Bon Accueil</h1>
            <p className="text-sm text-ink/70">
              Connectez-vous pour gérer vos réservations et accéder à votre espace.
            </p>
          </div>
          <Suspense fallback={<p className="text-center text-ink/60">Chargement…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
