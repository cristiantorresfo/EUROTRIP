"use client";

import {
  CheckCircle2,
  Clock3,
  Coffee,
  ExternalLink,
  Footprints,
  Map,
  MapPinCheck,
  RefreshCcw,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { DailyRouteMap } from "@/components/itinerary/daily-route-map";
import type {
  DailyRoute,
  Place,
  RouteIntensity,
} from "@/domain/trip/types";
import { buildGoogleMapsDirectionsUrl } from "@/lib/google-maps";

interface DailyRoutePreviewProps {
  readonly route: DailyRoute;
  readonly places: readonly Place[];
}

const intensityLabels: Record<RouteIntensity, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

export function DailyRoutePreview({ route, places }: DailyRoutePreviewProps) {
  const [selectedOptionId, setSelectedOptionId] = useState(
    route.defaultOptionId,
  );
  const selectedOption =
    route.options.find((option) => option.id === selectedOptionId) ??
    route.options[0];

  if (!selectedOption) return null;

  const resolvedStops = selectedOption.stops.flatMap((stop) => {
    const place = places.find((candidate) => candidate.id === stop.placeId);

    return place?.geoCoordinates
      ? [{ stop, coordinates: place.geoCoordinates }]
      : [];
  });
  const directionsUrl =
    resolvedStops.length === selectedOption.stops.length &&
    resolvedStops.length >= 2
      ? buildGoogleMapsDirectionsUrl(
          resolvedStops.map(({ coordinates }) => coordinates),
        )
      : null;
  const routedSegment = selectedOption.segments.find(
    (segment) => segment.routingStatus === "verified",
  );
  const relaxedOption = route.options.find((option) => option.id === "relaxed");

  return (
    <section className="day-section" aria-labelledby="daily-route-heading">
      <div className="section-heading">
        <Map aria-hidden="true" size={19} />
        <div>
          <h2 id="daily-route-heading">Recorrido del día</h2>
          <p>Elige el ritmo y conserva la opción de acortar sobre la marcha.</p>
        </div>
      </div>

      <div className="route-preview">
        <div className="route-preview__topline">
          <div>
            <span className="status-badge" data-status="planned">
              Ruta calculada · revisar en 2027
            </span>
            <h3>{route.title}</h3>
          </div>
          <Footprints aria-hidden="true" size={22} />
        </div>

        {route.summary ? (
          <p className="route-preview__summary">{route.summary}</p>
        ) : null}

        {route.options.length > 1 ? (
          <div className="route-choice">
            <div className="route-choice__prompt">
              <span>Decisión rápida</span>
              <h4>¿Cómo se sienten ahora?</h4>
              <p>Elijan el ritmo del grupo. Pueden cambiarlo después.</p>
            </div>

            <div
              className="route-option-picker"
              role="group"
              aria-label="Elegir variante del recorrido"
            >
              {route.options.map((option) => {
                const isSelected = option.id === selectedOption.id;
                const isRelaxed = option.intensity === "low";
                const OptionIcon = isRelaxed ? Coffee : Zap;

                return (
                  <button
                    className="route-option-card"
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    data-intensity={option.intensity}
                    data-selected={isSelected}
                    onClick={() => setSelectedOptionId(option.id)}
                  >
                    <span className="route-option-card__icon" aria-hidden="true">
                      <OptionIcon size={20} />
                    </span>
                    <span className="route-option-card__content">
                      <span className="route-option-card__eyebrow">
                        {isRelaxed
                          ? "Recomendado al llegar"
                          : "Para aprovechar la tarde"}
                      </span>
                      <strong>
                        {isRelaxed
                          ? "Estamos cansados"
                          : "Tenemos buena energía"}
                      </strong>
                      <span className="route-option-card__name">
                        {option.name}
                      </span>
                      <span className="route-option-card__meta">
                        <span>{option.estimatedDuration}</span>
                        <span>{option.stops.length} paradas</span>
                      </span>
                    </span>
                    <span
                      className="route-option-card__state"
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 aria-hidden="true" size={15} />
                          Elegida
                        </>
                      ) : (
                        "Elegir"
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="route-option-context" aria-live="polite">
          <CheckCircle2 aria-hidden="true" size={18} />
          <div>
            <span>Ruta activa</span>
            <strong>{selectedOption.name}</strong>
            <p>{selectedOption.recommendedWhen}</p>
          </div>
        </div>

        {routedSegment && resolvedStops.length === selectedOption.stops.length ? (
          <>
            <dl className="route-preview__facts">
              <div>
                <dt>Distancia</dt>
                <dd>{(routedSegment.distanceMeters / 1000).toFixed(1)} km</dd>
              </div>
              <div>
                <dt>Caminata</dt>
                <dd>≈ {routedSegment.durationMinutes} min</dd>
              </div>
              <div>
                <dt>Intensidad</dt>
                <dd>{intensityLabels[selectedOption.intensity]}</dd>
              </div>
            </dl>
            <DailyRouteMap
              key={selectedOption.id}
              label={`Mapa de ${selectedOption.name.toLocaleLowerCase("es")}`}
              stops={resolvedStops.map(({ stop, coordinates }) => ({
                id: stop.id,
                label: stop.label,
                order: stop.order,
                coordinates,
              }))}
              segment={routedSegment}
            />
          </>
        ) : null}

        <ol className="route-stop-list">
          {resolvedStops.map(({ stop, coordinates }) => (
            <li key={stop.id}>
              <span aria-hidden="true">{stop.order}</span>
              <div>
                <div className="route-stop-list__title">
                  <h4>{stop.label}</h4>
                  {stop.optional ? <small>Opcional</small> : null}
                </div>
                {stop.suggestedTimeWindow ? (
                  <p className="route-stop-list__time">
                    <Clock3 aria-hidden="true" size={13} />
                    <strong>
                      {stop.suggestedTimeWindow.start}–
                      {stop.suggestedTimeWindow.end}
                    </strong>
                    <span>orientativo</span>
                  </p>
                ) : null}
                <p>
                  <MapPinCheck aria-hidden="true" size={13} />
                  {stop.estimatedVisitMinutes
                    ? `≈ ${stop.estimatedVisitMinutes} min`
                    : "Coordenada pública verificada"}
                  {stop.visitMode === "exterior" ? " · solo exterior" : ""}
                  {stop.preferredMoment === "sunset" ? " · al atardecer" : ""}
                </p>
                {stop.highlights?.length ? (
                  <p>{stop.highlights.join(" · ")}</p>
                ) : null}
                {stop.notes ? <p>{stop.notes}</p> : null}
                <a
                  href={coordinates.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver coordenada
                  <ExternalLink aria-hidden="true" size={12} />
                </a>
              </div>
            </li>
          ))}
        </ol>

        {selectedOption.returnRoute ? (
          <div className="route-preview__return">
            <strong>Regreso sugerido</strong>
            <p>{selectedOption.returnRoute}</p>
            {selectedOption.returnDestination ? (
              <address>{selectedOption.returnDestination}</address>
            ) : null}
            {selectedOption.returnNotes ? (
              <small>{selectedOption.returnNotes}</small>
            ) : null}
          </div>
        ) : null}

        {route.switchDuringRoute &&
        relaxedOption &&
        selectedOption.id !== relaxedOption.id ? (
          <button
            className="route-preview__switch"
            type="button"
            onClick={() => setSelectedOptionId(relaxedOption.id)}
          >
            <RefreshCcw aria-hidden="true" size={15} />
            Cambiar a ruta relajada
          </button>
        ) : null}

        {route.switchRule ? (
          <p className="route-preview__note">{route.switchRule}</p>
        ) : null}
        {route.notes ? <p className="route-preview__note">{route.notes}</p> : null}

        {routedSegment ? (
          <p className="route-preview__source">
            Caminata calculada con Valhalla y datos de OpenStreetMap el{" "}
            {new Intl.DateTimeFormat("es-CO", {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(`${routedSegment.verifiedAt}T00:00:00Z`))}
            . No reemplaza señalización, cierres ni condiciones reales.
            <a
              href={routedSegment.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Metodología
              <ExternalLink aria-hidden="true" size={12} />
            </a>
          </p>
        ) : null}

        {directionsUrl ? (
          <a
            className="route-preview__action"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir esta variante en Google Maps
            <ExternalLink aria-hidden="true" size={15} />
          </a>
        ) : null}
      </div>
    </section>
  );
}
