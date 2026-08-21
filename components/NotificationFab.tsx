"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";
import { usePathname } from "next/navigation";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

export function NotificationFab() {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/unread", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { unread: number; authenticated: boolean };
      setAuthenticated(data.authenticated);
      setUnread(data.unread);
    } catch {
      setAuthenticated(false);
      setUnread(0);
    }
  }, []);

  useEffect(() => {
    refreshUnread();
    const interval = setInterval(refreshUnread, 45000);
    return () => clearInterval(interval);
  }, [refreshUnread, pathname]);

  async function handleOpen() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?unread=1", { cache: "no-store" });
      const data = res.ok ? ((await res.json()) as { notifications: NotificationItem[] }) : { notifications: [] };
      setItems(data.notifications);
      setOpen(true);
      await fetch("/api/notifications", { method: "POST" });
      setUnread(0);
    } finally {
      setLoading(false);
    }
  }

  if (!authenticated || pathname.startsWith("/admin")) {
    return null;
  }

  const showFab = unread > 0;

  return (
    <>
      {showFab && (
        <button
          type="button"
          onClick={handleOpen}
          disabled={loading}
          aria-label={`${unread} notification${unread > 1 ? "s" : ""} non lue${unread > 1 ? "s" : ""}`}
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-full bg-palm-deep text-linen shadow-lg hover:bg-palm transition-colors"
        >
          <Bell size={20} />
          <span className="text-sm font-medium">{unread}</span>
          <span className="text-sm hidden sm:inline">Notification{unread > 1 ? "s" : ""}</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-palm-deep/40"
            aria-label="Fermer"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md bg-linen rounded-sm shadow-2xl border border-palm-soft/50 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-palm-soft/40">
              <h2 className="font-display text-lg text-palm-deep">Vos notifications</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-ink/60 hover:text-ink"
                aria-label="Fermer le panneau"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4 flex-1">
              {items.length === 0 ? (
                <p className="text-sm text-ink/60">Aucune notification non lue.</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="text-sm border-l-2 border-palm pl-3">
                      <p className="font-medium text-palm-deep">{item.title}</p>
                      <p className="text-ink/80 mt-1 leading-relaxed">{item.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="px-5 py-4 border-t border-palm-soft/40">
              <Link
                href="/compte"
                onClick={() => setOpen(false)}
                className="block text-center text-sm text-palm-deep hover:opacity-70"
              >
                Voir tout mon espace client →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
