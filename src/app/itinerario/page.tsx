import { CalendarDays, MapPin, Plane, Sparkles } from "lucide-react";
import Link from "next/link";

import { tripCalendar } from "@/data/eurotrip-2027/calendar";
import type {
  CalendarDayKind,
  LocalDate,
  PlanningStatus,
} from "@/domain/trip/types";

const statusLabels: Record<PlanningStatus, string> = {
  confirmed: "Confirmado",
  planned: "Planeado",
  estimated: "Estimado",
  tentative: "Tentativo",
  to_verify: "Por verificar",
};

const kindIcons: Record<CalendarDayKind, typeof MapPin> = {
  travel: Plane,
  base: MapPin,
  day_trip: Sparkles,
};

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "short",
  day: "numeric",
  timeZone: "UTC",
});

function formatCalendarDate(localDate: LocalDate) {
  return dateFormatter.format(new Date(`${localDate}T00:00:00Z`)).replace(".", "");
}

const monthGroups = [
  {
    key: "2027-05",
    label: "Mayo",
    days: tripCalendar.filter((day) => day.localDate.startsWith("2027-05")),
  },
  {
    key: "2027-06",
    label: "Junio",
    days: tripCalendar.filter((day) => day.localDate.startsWith("2027-06")),
  },
] as const;

export default function ItineraryPage() {
  return (
    <div className="itinerary-page">
      <header className="page-heading">
        <span className="page-heading__icon" aria-hidden="true">
          <CalendarDays size={22} />
        </span>
        <div>
          <p className="eyebrow">ITINERARIO GENERAL</p>
          <h1 className="page-title">17 días, cinco bases</h1>
          <p className="page-description">
            Primera distribución del viaje. Las franjas internas siguen sin comprar
            y pueden cambiar cuando existan servicios reales para 2027.
          </p>
        </div>
      </header>

      <section className="status-legend" aria-label="Leyenda de estados">
        <span data-status="confirmed">Confirmado</span>
        <span data-status="planned">Planeado</span>
        <span data-status="tentative">Tentativo</span>
        <span data-status="to_verify">Por verificar</span>
      </section>

      <div className="calendar-months">
        {monthGroups.map((month) => (
          <section className="calendar-month" key={month.key}>
            <div className="month-heading">
              <h2>{month.label}</h2>
              <span>{month.days.length} días</span>
            </div>

            <ol className="calendar-list">
              {month.days.map((day) => {
                const Icon = kindIcons[day.kind];

                return (
                  <li className="calendar-day" key={day.localDate}>
                    <Link
                      className="calendar-day__link"
                      href={`/itinerario/${day.localDate}`}
                    >
                      <time className="date-chip" dateTime={day.localDate}>
                        {formatCalendarDate(day.localDate)}
                      </time>

                      <div className="calendar-day__content">
                        <div className="calendar-day__topline">
                          <span className="location-label">
                            <Icon aria-hidden="true" size={15} />
                            {day.locationLabel}
                          </span>
                          <span className="status-badge" data-status={day.status}>
                            {statusLabels[day.status]}
                          </span>
                        </div>
                        <h3>{day.title}</h3>
                        {day.detail ? <p>{day.detail}</p> : null}
                        {day.kind === "day_trip" && day.baseCity ? (
                          <small>Base: {day.baseCity}</small>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
