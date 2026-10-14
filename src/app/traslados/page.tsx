import { AlertTriangle, CheckCircle2, Clock3, Route } from "lucide-react";
import Link from "next/link";

import { TransportLegCard } from "@/components/transport/transport-leg-card";
import { TransportHubCard } from "@/components/transport/transport-hub-card";
import { tripCalendar } from "@/data/eurotrip-2027/calendar";
import { transportHubReferences } from "@/data/eurotrip-2027/transport-hubs";
import {
  bookedTransportLegs,
  plannedTransportLegs,
} from "@/data/eurotrip-2027/transport";
import { getTransportLegsForDate } from "@/domain/trip/selectors";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

const plannedDays = tripCalendar.flatMap((day) => {
  const legs = getTransportLegsForDate(plannedTransportLegs, day.localDate);

  return legs.length > 0 ? [{ day, legs }] : [];
});

function formatDate(localDate: string) {
  return dateFormatter.format(new Date(`${localDate}T00:00:00Z`));
}

export default function TransportPage() {
  return (
    <div className="transport-page">
      <header className="page-heading">
        <span className="page-heading__icon" aria-hidden="true">
          <Route size={22} />
        </span>
        <div>
          <p className="eyebrow">TRANSPORTE</p>
          <h1 className="page-title">Dos reservas, once tramos por comprar</h1>
          <p className="page-description">
            Las horas confirmadas pertenecen únicamente a los vuelos
            internacionales. El resto son ventanas para comparar billetes.
          </p>
        </div>
      </header>

      <aside className="planning-notice" aria-label="Aviso de planificación">
        <AlertTriangle aria-hidden="true" size={20} />
        <div>
          <strong>No usar las ventanas como horarios de viaje</strong>
          <p>
            Aeropuertos, estaciones, precios, equipaje y servicios internos
            siguen pendientes de verificar antes de comprar.
          </p>
        </div>
      </aside>

      <section className="transport-section" aria-labelledby="booked-heading">
        <div className="transport-section__heading">
          <CheckCircle2 aria-hidden="true" size={20} />
          <div>
            <h2 id="booked-heading">Comprado</h2>
            <p>Vuelos internacionales confirmados por el viajero.</p>
          </div>
        </div>

        <div className="transport-grid">
          {bookedTransportLegs.map((leg) => (
            <TransportLegCard key={leg.id} leg={leg} />
          ))}
        </div>
      </section>

      <section className="transport-section" aria-labelledby="planned-heading">
        <div className="transport-section__heading">
          <Clock3 aria-hidden="true" size={20} />
          <div>
            <h2 id="planned-heading">Por comparar y comprar</h2>
            <p>Ocho fechas de búsqueda, agrupadas por jornada.</p>
          </div>
        </div>

        <div className="transport-days">
          {plannedDays.map(({ day, legs }) => (
            <section className="transport-day" key={day.localDate}>
              <div className="transport-day__heading">
                <div>
                  <time dateTime={day.localDate}>{formatDate(day.localDate)}</time>
                  <h3>{day.locationLabel}</h3>
                </div>
                <Link href={`/itinerario/${day.localDate}`}>Ver día</Link>
              </div>

              <div className="transport-grid">
                {legs.map((leg) => (
                  <TransportLegCard key={leg.id} leg={leg} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="transport-section" aria-labelledby="hubs-heading">
        <div className="transport-section__heading">
          <Route aria-hidden="true" size={20} />
          <div>
            <h2 id="hubs-heading">Terminales públicas de referencia</h2>
            <p>
              Abrir un lugar no confirma que el futuro billete salga o llegue
              allí. Las opciones candidatas conservan el estado por verificar.
            </p>
          </div>
        </div>

        <div className="transport-hubs">
          {transportHubReferences.map((reference) => (
            <TransportHubCard
              key={reference.place.id}
              reference={reference}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
