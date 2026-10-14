import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  CircleEllipsis,
  MapPinned,
} from "lucide-react";
import Link from "next/link";

import { accommodations } from "@/data/eurotrip-2027/accommodations";
import { tripCalendar } from "@/data/eurotrip-2027/calendar";
import { tripDayPlans } from "@/data/eurotrip-2027/day-plans";
import { bookedTransportLegs } from "@/data/eurotrip-2027/transport";
import { cityStays, euroTrip2027 } from "@/data/eurotrip-2027/trip";
import {
  getDashboardNextItem,
  getItineraryProgress,
} from "@/domain/trip/dashboard";
import { getTotalNights } from "@/domain/trip/selectors";
import { getRelevantTripLocalDate } from "@/domain/trip/today";
import type { PlanningStatus } from "@/domain/trip/types";

export const dynamic = "force-dynamic";

const statusLabels: Record<PlanningStatus, string> = {
  confirmed: "Confirmado",
  planned: "Planeado",
  estimated: "Estimado",
  tentative: "Tentativo",
  to_verify: "Por verificar",
};

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatLocalDate(localDate: string) {
  return dateFormatter.format(new Date(`${localDate}T00:00:00Z`));
}

export default function Home() {
  const tripFacts = [
    { label: "Viajeros", value: euroTrip2027.travelerCount },
    { label: "Noches", value: getTotalNights(accommodations) },
    { label: "Estancias", value: accommodations.length },
  ] as const;
  const route = cityStays.map((stay) => stay.city).join(" → ");
  const localDate = getRelevantTripLocalDate(new Date(), euroTrip2027);
  const nextItem = getDashboardNextItem(
    localDate,
    euroTrip2027,
    bookedTransportLegs,
    tripDayPlans,
  );
  const progress = getItineraryProgress(tripCalendar, tripDayPlans);

  return (
    <div className="dashboard-page">
      <section className="hero" aria-labelledby="trip-title">
        <div className="hero__content">
          <p className="eyebrow">29 MAY — 14 JUN · 2027</p>
          <h1 id="trip-title">EuroTrip 2027</h1>
          <p className="intro">
            Un asistente privado y móvil para organizar el itinerario, los traslados
            y el presupuesto sin confundir planes con reservas confirmadas.
          </p>

          <p className="route" aria-label="Ruta general del viaje">
            {route}
          </p>

          <dl className="trip-facts" aria-label="Resumen del viaje">
            {tripFacts.map((fact) => (
              <div className="fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="status" role="status">
            <span aria-hidden="true" />
            Datos confirmados y propuestas claramente separados
          </div>

          <Link className="primary-action" href="/itinerario">
            <CalendarDays aria-hidden="true" size={19} />
            Ver itinerario completo
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-card dashboard-card--next">
          <div className="dashboard-card__heading">
            <span aria-hidden="true">
              {nextItem?.kind === "booked_transport" ? (
                <CheckCircle2 size={20} />
              ) : (
                <MapPinned size={20} />
              )}
            </span>
            <div>
              <p className="eyebrow">
                {nextItem?.kind === "booked_transport"
                  ? "PRÓXIMO EVENTO"
                  : "PRIMER BLOQUE DEL DÍA"}
              </p>
              <h2>Lo siguiente</h2>
            </div>
          </div>

          {nextItem ? (
            <>
              <div className="dashboard-card__topline">
                <time dateTime={nextItem.localDate}>
                  {formatLocalDate(nextItem.localDate)}
                </time>
                <span className="status-badge" data-status={nextItem.status}>
                  {statusLabels[nextItem.status]}
                </span>
              </div>
              <h3>{nextItem.title}</h3>
              <p>{nextItem.detail}</p>
              <Link className="dashboard-card__link" href={nextItem.href}>
                Abrir detalle
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </>
          ) : (
            <div className="dashboard-empty">
              <CheckCircle2 aria-hidden="true" size={20} />
              <p>El viaje ya finalizó; el itinerario permanece disponible.</p>
            </div>
          )}
        </section>

        <section className="dashboard-card" aria-labelledby="progress-heading">
          <div className="dashboard-card__heading">
            <span aria-hidden="true">
              <CalendarCheck2 size={20} />
            </span>
            <div>
              <p className="eyebrow">COBERTURA DEL BORRADOR</p>
              <h2 id="progress-heading">{progress.coveragePercentage}% planeado</h2>
            </div>
          </div>

          <progress
            className="dashboard-progress"
            value={progress.coveredDayCount}
            max={progress.totalDayCount}
          >
            {progress.coveragePercentage}%
          </progress>
          <p className="dashboard-progress__caption">
            {progress.coveredDayCount} de {progress.totalDayCount} jornadas tienen
            actividades. Los dos días restantes son vuelos internacionales.
          </p>

          <dl className="dashboard-metrics">
            <div>
              <dt>Bloques</dt>
              <dd>{progress.activityCount}</dd>
            </div>
            <div>
              <dt>Pausas</dt>
              <dd>{progress.recoveryBlockCount}</dd>
            </div>
            <div>
              <dt>Reservas</dt>
              <dd>{progress.reservedActivityCount}</dd>
            </div>
          </dl>

          <div className="dashboard-disclaimer">
            <CircleEllipsis aria-hidden="true" size={17} />
            <p>Las visitas siguen sin hora y no cuentan como entradas compradas.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
