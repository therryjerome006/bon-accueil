"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type AdminGateFormProps = {
  configured: boolean;
};

export function AdminGateForm({ configured }: AdminGateFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Code incorrect.");
        return;
      }
      router.replace(redirect.startsWith("/admin") ? redirect : "/admin");
      router.refresh();
    } catch {
      setError("Impossible de vérifier le code. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
        Définissez <code className="text-xs">ADMIN_GATE_PASSWORD</code> (et idéalement{" "}
        <code className="text-xs">ADMIN_GATE_SECRET</code>) dans <code className="text-xs">.env.local</code>, puis
        redémarrez le serveur.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="admin-gate-password" className="block text-sm font-medium text-ink mb-1.5">
          Code d’accès admin
        </label>
        <input
          id="admin-gate-password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-palm-soft/60 rounded-sm px-3 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-palm/40"
          placeholder="Mot de passe de la zone admin"
          required
        />
      </div>
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full py-3 text-sm font-semibold bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors disabled:opacity-50"
      >
        {loading ? "Vérification…" : "Accéder à l’administration"}
      </button>
    </form>
  );
}
