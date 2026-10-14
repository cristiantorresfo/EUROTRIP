"use client";

import {
  CalendarClock,
  CalendarDays,
  House,
  Route,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "Inicio", icon: House },
  { href: "/hoy", label: "Hoy", icon: CalendarClock },
  { href: "/itinerario", label: "Itinerario", icon: CalendarDays },
  { href: "/traslados", label: "Traslados", icon: Route },
  { href: "/presupuesto", label: "Gastos", icon: WalletCards },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bottom-navigation" aria-label="Navegación principal">
      <div className="bottom-navigation__inner">
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              className="bottom-navigation__link"
              data-active={isActive}
              href={href}
              key={href}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon aria-hidden="true" size={21} strokeWidth={2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
