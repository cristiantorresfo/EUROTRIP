import { CalendarDays, Route, WifiOff } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sin conexión | EuroTrip 2027",
};

export default function OfflinePage() {
  return (
    <section className="offline-page" aria-labelledby="offline-title">
      <article className="offline-card">
        <span className="offline-card__icon" aria-hidden="true">
          <WifiOff size={30} />
        </span>

        <p className="eyebrow">MODO OFFLINE</p>
        <h1 className="page-title" id="offline-title">
          Sin conexión
        </h1>
        <p className="page-description">
          No pudimos actualizar la información. Puedes consultar las secciones
          públicas que ya se hayan guardado en este dispositivo.
        </p>

        <div className="offline-card__actions">
          <Link href="/itinerario">
            <CalendarDays aria-hidden="true" size={18} />
            Ver itinerario
          </Link>
          <Link href="/traslados">
            <Route aria-hidden="true" size={18} />
            Ver traslados
          </Link>
        </div>

        <p className="offline-card__note">
          Los enlaces externos de mapas y cualquier actualización requieren
          conexión a internet.
        </p>
      </article>
    </section>
  );
}
