import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { BottomNavigation } from "./bottom-navigation";

interface AppShellProps {
  readonly children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#contenido-principal">
        Ir al contenido
      </a>

      <header className="top-bar">
        <Link className="brand" href="/" aria-label="EuroTrip 2027, inicio">
          <span className="brand__mark" aria-hidden="true">
            E
          </span>
          <span>
            <strong>EuroTrip</strong>
            <small>29 may — 14 jun 2027</small>
          </span>
        </Link>

        <span
          className="privacy-badge"
          aria-label="Esta versión solo contiene datos públicos"
        >
          <ShieldCheck aria-hidden="true" size={14} />
          Datos públicos
        </span>
      </header>

      <main className="page-content" id="contenido-principal">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}
