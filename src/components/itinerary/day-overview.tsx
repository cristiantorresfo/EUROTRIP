import {
  BedDouble,
  CheckCircle2,
  Clock3,
  Coffee,
  ExternalLink,
  Footprints,
  MapPin,
  Plane,
  TrainFront,
  Utensils,
} from "lucide-react";

import { buildGoogleMapsSearchUrl } from "@/lib/google-maps";

import type {
  Accommodation,
  ActivityCategory,
  DayPlan,
  Place,
  PlannedTransportLeg,
  PlanningStatus,
  TripDaySummary,
} from "@/domain/trip/types";

const statusLabels: Record<PlanningStatus, string> = {
  confirmed: "Confirmado",
  planned: "Planeado",
  estimated: "Estimado",
  tentative: "Tentativo",
  to_verify: "Por verificar",
};

const locationLabels: Record<string, string> = {
  madrid: "Madrid",
  toledo: "Toledo",
  barcelona: "Barcelona",
  paris: "París",
  bologna: "Bolonia",
  venice: "Venecia",
  florence: "Florencia",
  rome: "Roma",
};

const activityIcons: Record<ActivityCategory, typeof MapPin> = {
  visit: MapPin,
  meal: Utensils,
  rest: Coffee,
  transfer: TrainFront,
  other: Footprints,
};

const activityCategoryLabels: Record<ActivityCategory, string> = {
  visit: "Visita",
  meal: "Comida y pausa",
  rest: "Descanso",
  transfer: "Traslado",
  other: "Flexible",
};

interface DayOverviewProps {
  readonly day: TripDaySummary;
  readonly accommodation?: Accommodation;
  readonly checkIn?: Accommodation;
  readonly checkOut?: Accommodation;
  readonly transportLegs: readonly PlannedTransportLeg[];
  readonly dayPlan?: DayPlan;
  readonly places: readonly Place[];
}

function transportLabel(leg: PlannedTransportLeg) {
  const origin = locationLabels[leg.originId] ?? leg.originId;
  const destination = locationLabels[leg.destinationId] ?? leg.destinationId;

  return `${origin} → ${destination}`;
}

export function DayOverview({
  day,
  accommodation,
  checkIn,
  checkOut,
  transportLegs,
  dayPlan,
  places,
}: DayOverviewProps) {
  return (
    <div className="day-overview">
      <section className="day-hero">
        <div className="day-hero__topline">
          <span className="location-label">
            <MapPin aria-hidden="true" size={16} />
            {day.locationLabel}
          </span>
          <span className="status-badge" data-status={day.status}>
            {statusLabels[day.status]}
          </span>
        </div>
        <h1>{day.title}</h1>
        {day.detail ? <p>{day.detail}</p> : null}
        {day.kind === "day_trip" && day.baseCity ? (
          <small>Regreso y alojamiento en {day.baseCity}</small>
        ) : null}
      </section>

      <section className="day-section" aria-labelledby="transport-heading">
        <div className="section-heading">
          <Clock3 aria-hidden="true" size={19} />
          <div>
            <h2 id="transport-heading">Traslados del día</h2>
            <p>Las franjas propuestas no son billetes ni horarios reales.</p>
          </div>
        </div>

        {transportLegs.length > 0 ? (
          <div className="detail-list">
            {transportLegs.map((leg) => {
              const Icon = leg.mode === "flight" ? Plane : TrainFront;

              return (
                <article className="detail-card" key={leg.id}>
                  <span className="detail-card__icon" aria-hidden="true">
                    <Icon size={19} />
                  </span>
                  <div>
                    <div className="detail-card__title-row">
                      <h3>{transportLabel(leg)}</h3>
                      <span data-status={leg.planningStatus}>
                        {statusLabels[leg.planningStatus]}
                      </span>
                    </div>
                    <p>
                      Ventana objetivo {leg.preferredDepartureWindow.start}–
                      {leg.preferredDepartureWindow.end} · no reservado
                    </p>
                    {leg.notes ? <small>{leg.notes}</small> : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <CheckCircle2 aria-hidden="true" size={20} />
            <p>No hay un traslado interno definido para esta fecha.</p>
          </div>
        )}
      </section>

      <section className="day-section" aria-labelledby="stay-heading">
        <div className="section-heading">
          <BedDouble aria-hidden="true" size={19} />
          <div>
            <h2 id="stay-heading">Estancia</h2>
            <p>Solo se muestra la zona pública del alojamiento.</p>
          </div>
        </div>

        {accommodation || checkOut ? (
          <div className="stay-list">
            {checkOut && accommodation && checkOut.id !== accommodation.id ? (
              <article className="stay-card">
                <span className="status-badge" data-status="confirmed">
                  Confirmado
                </span>
                <h3>Salida de {checkOut.city}</h3>
                <p>{checkOut.publicArea}</p>
                <dl>
                  <div>
                    <dt>Check-out</dt>
                    <dd>Hora por confirmar</dd>
                  </div>
                </dl>
              </article>
            ) : null}

            {accommodation ? (
              <article className="stay-card">
                <span className="status-badge" data-status="confirmed">
                  Confirmado
                </span>
                <h3>Noche en {accommodation.city}</h3>
                <p>{accommodation.publicArea}</p>
                <dl>
                  {checkIn?.id === accommodation.id ? (
                    <div>
                      <dt>Check-in</dt>
                      <dd>Desde {checkIn.checkInFromLocal}</dd>
                    </div>
                  ) : null}
                  {checkOut?.id === accommodation.id ? (
                    <div>
                      <dt>Check-out</dt>
                      <dd>Hora por confirmar</dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            ) : null}

            {!accommodation && checkOut ? (
              <article className="stay-card">
                <span className="status-badge" data-status="confirmed">
                  Confirmado
                </span>
                <h3>Salida de {checkOut.city}</h3>
                <p>{checkOut.publicArea}</p>
                <dl>
                  <div>
                    <dt>Check-out</dt>
                    <dd>Hora por confirmar</dd>
                  </div>
                </dl>
              </article>
            ) : null}
          </div>
        ) : (
          <div className="empty-state">
            <BedDouble aria-hidden="true" size={20} />
            <p>Esta jornada corresponde al vuelo nocturno de ida.</p>
          </div>
        )}
      </section>

      <section className="day-section" aria-labelledby="activities-heading">
        <div className="section-heading">
          <MapPin aria-hidden="true" size={19} />
          <div>
            <h2 id="activities-heading">Actividades</h2>
            <p>Borrador por orden, sin convertir estimaciones en reservas.</p>
          </div>
        </div>

        {dayPlan && dayPlan.plannedActivities.length > 0 ? (
          <ol className="activity-list">
            {dayPlan.plannedActivities.map((plannedActivity) => {
              const Icon = activityIcons[plannedActivity.category];
              const place = plannedActivity.placeId
                ? places.find((candidate) => candidate.id === plannedActivity.placeId)
                : undefined;

              return (
                <li className="activity-card" key={plannedActivity.id}>
                  <span className="activity-card__order" aria-hidden="true">
                    {plannedActivity.order}
                  </span>
                  <div className="activity-card__body">
                    <div className="activity-card__topline">
                      <span>
                        <Icon aria-hidden="true" size={15} />
                        {activityCategoryLabels[plannedActivity.category]}
                      </span>
                      <span
                        className="status-badge"
                        data-status={plannedActivity.status}
                      >
                        {statusLabels[plannedActivity.status]}
                      </span>
                    </div>
                    <h3>{plannedActivity.title}</h3>
                    <p>
                      Sin hora · duración de planificación: aprox. {" "}
                      {plannedActivity.expectedDurationMinutes} min
                    </p>
                    {plannedActivity.notes ? (
                      <small>{plannedActivity.notes}</small>
                    ) : null}

                    {place ? (
                      <div className="activity-card__actions">
                        <a
                          href={buildGoogleMapsSearchUrl(
                            `${place.title}, ${place.city}`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Google Maps
                          <ExternalLink aria-hidden="true" size={13} />
                        </a>
                        {place.officialUrl ? (
                          <a
                            href={place.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Fuente oficial
                            <ExternalLink aria-hidden="true" size={13} />
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="empty-state empty-state--dashed">
            <p>Jornada dedicada al vuelo internacional; no se añadieron visitas.</p>
          </div>
        )}
      </section>
    </div>
  );
}
