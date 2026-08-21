"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getPostLoginPath, safeRedirectPath } from "@/lib/auth-utils";

type Mode = "login" | "signup";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const inputClass =
    "w-full px-4 py-3 text-sm bg-white border border-palm-soft/60 rounded-sm focus:outline-none focus:border-palm transition-colors";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.user && !data.session) {
          setMessage("Compte créé. Vérifiez votre email pour confirmer votre inscription.");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (signInError) {
          setError("Email ou mot de passe incorrect.");
          return;
        }
      }

      const meRes = await fetch("/api/auth/me", { cache: "no-store" });
      const me = meRes.ok ? ((await meRes.json()) as { isAdmin: boolean }) : { isAdmin: false };

      const defaultPath = getPostLoginPath(me.isAdmin ? "admin" : "user");
      const safeRedirect = safeRedirectPath(redirect, defaultPath);
      const destination =
        redirect.startsWith("/admin") && !me.isAdmin ? defaultPath : safeRedirect;

      router.push(destination);
      router.refresh();
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex gap-2 mb-8 p-1 bg-sand/60 rounded-sm">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
            setMessage(null);
          }}
          className={`flex-1 py-2.5 text-sm tracking-wide rounded-sm transition-colors ${
            mode === "login" ? "bg-palm-deep text-linen" : "text-palm-deep hover:bg-white/50"
          }`}
        >
          Connexion
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
            setMessage(null);
          }}
          className={`flex-1 py-2.5 text-sm tracking-wide rounded-sm transition-colors ${
            mode === "signup" ? "bg-palm-deep text-linen" : "text-palm-deep hover:bg-white/50"
          }`}
        >
          Inscription
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {mode === "signup" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-xs uppercase tracking-wide text-palm mb-2">
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs uppercase tracking-wide text-palm mb-2">
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-wide text-palm mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs uppercase tracking-wide text-palm mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="text-sm text-palm-deep bg-sand border border-palm-soft/50 rounded-sm px-4 py-3">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors disabled:opacity-50"
        >
          {loading ? "Chargement…" : mode === "login" ? "Se connecter" : "Créer un compte"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink/60">
        <Link href="/" className="text-palm-deep hover:opacity-70">
          ← Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}
