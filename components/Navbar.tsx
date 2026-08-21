"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { MENU_ITEMS, RESERVE_ITEMS } from "@/lib/navigation";
import { AuthNav } from "@/components/AuthNav";

type NavbarProps = {
  /** Transparent sur le hero de la page d'accueil, opaque sur les autres pages */
  variant?: "hero" | "default";
};

export function Navbar({ variant = "default" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHero = variant === "hero";
  const isOpaque = !isHero || scrolled;

  useEffect(() => {
    if (!isHero) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHero]);

  const navTextColor = isOpaque ? "text-palm-deep" : "text-linen";

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isOpaque ? "bg-linen shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-20">
        <AuthNav className={`hidden md:inline-flex ${navTextColor}`} />

        <div className="flex items-center gap-6 md:gap-10">
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? <X size={22} className={navTextColor} /> : <Menu size={22} className={navTextColor} />}
          </button>

          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setReserveOpen(false);
              }}
              className={`flex items-center gap-1 text-sm tracking-wide ${navTextColor}`}
            >
              Menu <ChevronDown size={14} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            {menuOpen && (
              <div
                className="absolute top-10 left-0 w-48 py-3 rounded-sm shadow-xl bg-linen"
                onMouseLeave={() => setMenuOpen(false)}
              >
                {MENU_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-5 py-2 text-sm text-ink hover:opacity-70"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/"
            className={`font-display text-xl md:text-2xl tracking-wide whitespace-nowrap ${navTextColor}`}
          >
            Bon Accueil Hotel
          </Link>
        </div>

        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setReserveOpen(!reserveOpen);
              setMenuOpen(false);
            }}
            className="px-5 py-2.5 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors"
          >
            Réserver
          </button>
          {reserveOpen && (
            <div
              className="absolute top-12 right-0 w-52 py-3 rounded-sm shadow-xl bg-linen"
              onMouseLeave={() => setReserveOpen(false)}
            >
              {RESERVE_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-5 py-2 text-sm text-ink hover:opacity-70"
                  onClick={() => setReserveOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 bg-linen border-t border-palm-soft/40">
          <p className="text-xs uppercase tracking-wide text-palm pt-2">Menu</p>
          {MENU_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm text-ink" onClick={closeMobile}>
              {item.label}
            </Link>
          ))}
          <p className="text-xs uppercase tracking-wide text-palm pt-2">Réserver</p>
          {RESERVE_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm text-ink" onClick={closeMobile}>
              {item.label}
            </Link>
          ))}
          <AuthNav className="text-ink pt-2" onNavigate={closeMobile} />
        </div>
      )}
    </header>
  );
}
