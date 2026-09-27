import Link from "next/link";
import { headers } from "next/headers";
import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const isUnlock = pathname === "/admin/unlock" || pathname.startsWith("/admin/unlock/");

  if (isUnlock) {
    return children;
  }

  await requireAdmin();

  return (
    <div className="min-h-screen bg-linen flex flex-col">
      <header className="bg-palm-deep text-linen border-b border-white/10 shrink-0">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <Link href="/admin" className="font-display text-lg tracking-wide">
            Bon Accueil · Admin
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/" className="hover:opacity-70">
              Site public
            </Link>
            <form action="/auth/signout" method="post">
              <button type="submit" className="hover:opacity-70">
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row gap-8 flex-1 w-full">
        <AdminSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
