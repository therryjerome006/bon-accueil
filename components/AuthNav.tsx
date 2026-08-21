"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AuthNavProps = {
  className?: string;
  onNavigate?: () => void;
};

type SessionInfo = {
  authenticated: boolean;
  isAdmin: boolean;
};

export function AuthNav({ className = "", onNavigate }: AuthNavProps) {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) throw new Error("session");
        const data = (await res.json()) as SessionInfo;
        if (!cancelled) setSession(data);
      } catch {
        if (!cancelled) setSession({ authenticated: false, isAdmin: false });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSession();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <span className={`text-sm opacity-50 ${className}`}>…</span>;
  }

  if (!session?.authenticated) {
    return (
      <Link href="/login" className={`text-sm tracking-wide hover:opacity-70 ${className}`} onClick={onNavigate}>
        Log in
      </Link>
    );
  }

  return (
    <div className={`flex items-center gap-4 text-sm tracking-wide ${className}`}>
      {session.isAdmin && (
        <Link href="/admin" className="hover:opacity-70" onClick={onNavigate}>
          Admin
        </Link>
      )}
      <Link href="/compte" className="hover:opacity-70" onClick={onNavigate}>
        Mon compte
      </Link>
    </div>
  );
}
