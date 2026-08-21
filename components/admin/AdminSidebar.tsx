"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "@/lib/admin/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-56 shrink-0">
      <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {ADMIN_NAV.map((item) => {
          const { href, label, icon: Icon } = item;
          const active = "exact" in item && item.exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm rounded-sm whitespace-nowrap transition-colors ${
                active
                  ? "bg-palm-deep text-linen"
                  : "text-ink/70 hover:bg-sand/60 hover:text-palm-deep"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
