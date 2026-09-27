import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { AdminGateForm } from "@/components/admin/AdminGateForm";
import { adminGatePasswordConfigured } from "@/lib/admin/gate";

export default async function AdminUnlockPage() {
  await requireAdmin();
  const configured = adminGatePasswordConfigured();

  return (
    <main className="min-h-screen bg-linen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="text-xs tracking-[0.25em] uppercase text-palm mb-3">Sécurité admin</p>
        <h1 className="font-display text-3xl text-palm-deep mb-2">Second accès</h1>
        <p className="text-sm text-ink/70 mb-8 leading-relaxed">
          Votre compte a le rôle administrateur. Saisissez le code réservé à l’équipe pour ouvrir le panneau. Si vous
          quittez l’admin, ce code sera redemandé après une minute.
        </p>
        <Suspense fallback={null}>
          <AdminGateForm configured={configured} />
        </Suspense>
        <Link href="/" className="inline-block mt-8 text-sm text-palm-deep hover:opacity-70">
          ← Retour au site
        </Link>
      </div>
    </main>
  );
}
