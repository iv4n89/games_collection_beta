"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const mainItems: NavItem[] = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/explore", label: "Explorador de Módulos", icon: "explore" },
  { href: "/collection", label: "Mi Colección", icon: "library_books" },
  { href: "/wishlist", label: "Lista de Deseos", icon: "favorite" },
];

const settingsItem: NavItem = {
  href: "/settings",
  label: "Ajustes",
  icon: "settings",
};

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const base =
    "flex items-center gap-stack-sm px-4 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";
  const state = active
    ? "text-primary font-bold border-r-2 border-primary bg-surface-container-low"
    : "text-on-surface-variant font-medium hover:bg-surface-variant/50";
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`${base} ${state}`}
    >
      <span
        className="material-symbols-outlined"
        style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
        aria-hidden="true"
      >
        {item.icon}
      </span>
      <span className="text-body-md">{item.label}</span>
    </Link>
  );
}

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <>
      <ul className="flex-1 flex flex-col gap-base px-stack-sm">
        {mainItems.map((item) => (
          <li key={item.href}>
            <NavLink item={item} active={isActive(pathname, item.href)} />
          </li>
        ))}
      </ul>
      <div className="px-stack-sm">
        <NavLink
          item={settingsItem}
          active={isActive(pathname, settingsItem.href)}
        />
      </div>
    </>
  );
}
