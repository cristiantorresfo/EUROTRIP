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
  RouteTravelMode,
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

const travelModeLabels: Record<RouteTravelMode, string> = {
  walk: "A pie",
  metro: "Metro",
  bus: "Bus",
  train: "Tren",
  flight: "Vuelo",
  boat: "Barco",
  taxi: "Taxi",
  other: "Traslado por definir",
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
  const mapStops = resolvedStops.filter(({ stop }) => stop.mapVisible !== false);
  const routedSegments = selectedOption.segments.filter(
    (segment): segment is Extract<
      (typeof selectedOption.segments)[number],
      { routingStatus: "verified" }
    > => segment.routingStatus === "verified",
  );
  const routedDistanceMeters = routedSegments.reduce(
    (total, segment) => total + segment.distanceMeters,
    0,
  );
  const routedDurationMinutes = routedSegments.reduce(
    (total, segment) => total + segment.durationMinutes,
    0,
  );
  const isFullyWalkable = selectedOption.segments.every(
    (segment) =>
      segment.routingStatus === "verified" && segment.mode === "walk",
  );
  const singleRoutedSegment =
    routedSegments.length === 1 ? routedSegments[0] : undefined;
  const routedStartIndex = singleRoutedSegment
    ? resolvedStops.findIndex(
        ({ stop }) => stop.id === singleRoutedSegment.fromStopId,
      )
    : -1;
  const routedEndIndex = singleRoutedSegment
    ? resolvedStops.findIndex(
        ({ stop }) => stop.id === singleRoutedSegment.toStopId,
      )
    : -1;
  const directionStops = isFullyWalkable
    ? resolvedStops
    : routedStartIndex >= 0 && routedEndIndex > routedStartIndex
      ? resolvedStops.slice(routedStartIndex, routedEndIndex + 1)
      : [];
  const directionsUrl =
    directionStops.length >= 2
      ? buildGoogleMapsDirectionsUrl(
          directionStops.map(({ coordinates }) => coordinates),
        )
      : null;
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
                const isRelaxed = option.id === "relaxed";
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
                        {option.choiceEyebrow ??
                          (isRelaxed
                            ? "Recomendado al llegar"
                            : "Para aprovechar la tarde")}
                      </span>
                      <strong>
                        {option.choiceLabel ??
                          (isRelaxed
                            ? "Estamos cansados"
                            : "Tenemos buena energía")}
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

        {routedSegments.length > 0 && mapStops.length >= 2 ? (
          <>
            <dl className="route-preview__facts">
              <div>
                <dt>Distancia calculada</dt>
                <dd>{(routedDistanceMeters / 1000).toFixed(1)} km</dd>
              </div>
              <div>
                <dt>A pie calculado</dt>
                <dd>≈ {routedDurationMinutes} min</dd>
              </div>
              <div>
                <dt>Intensidad</dt>
                <dd>{intensityLabels[selectedOption.intensity]}</dd>
              </div>
            </dl>
            <DailyRouteMap
              key={selectedOption.id}
              label={`Mapa de ${selectedOption.name.toLocaleLowerCase("es")}`}
              stops={mapStops.map(({ stop, coordinates }) => ({
                id: stop.id,
                label: stop.label,
                order: stop.order,
                coordinates,
              }))}
              segments={selectedOption.segments}
            />
          </>
        ) : null}

        {selectedOption.segments.length > 1 ? (
          <div className="route-segment-list">
            <strong>Cómo se conecta el recorrido</strong>
            <ul>
              {selectedOption.segments.map((segment) => (
                <li key={segment.id}>
                  <span>{travelModeLabels[segment.mode]}</span>
                  <div>
                    <b>{segment.label ?? "Tramo del recorrido"}</b>
                    <small>
                      {segment.routingStatus === "verified"
                        ? `${(segment.distanceMeters / 1000).toFixed(1)} km · ≈ ${segment.durationMinutes} min calculados`
                        : "Pendiente de confirmar"}
                    </small>
                    {segment.notes ? <small>{segment.notes}</small> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <ol className="route-stop-list">
          {selectedOption.stops.map((stop) => {
            const coordinates = places.find(
              (place) => place.id === stop.placeId,
            )?.geoCoordinates;

            return (
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
                      : coordinates
                        ? coordinates.verificationStatus === "verified"
                          ? "Coordenada pública verificada"
                          : "Ubicación aproximada de la calle"
                        : "Ubicación o traslado por verificar"}
                    {stop.visitMode === "exterior" ? " · solo exterior" : ""}
                    {stop.preferredMoment === "sunset"
                      ? " · al atardecer"
                      : ""}
                  </p>
                  {stop.highlights?.length ? (
                    <p>{stop.highlights.join(" · ")}</p>
                  ) : null}
                  {stop.notes ? <p>{stop.notes}</p> : null}
                  {coordinates ? (
                    <a
                      href={coordinates.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver coordenada
                      <ExternalLink aria-hidden="true" size={12} />
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
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

        {routedSegments[0] ? (
          <p className="route-preview__source">
            {routedSegments.length === 1
              ? "Caminata calculada"
              : "Caminatas calculadas"}{" "}
            con Valhalla y datos de OpenStreetMap el{" "}
            {new Intl.DateTimeFormat("es-CO", {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(`${routedSegments[0].verifiedAt}T00:00:00Z`))}
            . No reemplaza señalización, cierres ni condiciones reales.
            <a
              href={routedSegments[0].sourceUrl}
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
            {isFullyWalkable
              ? "Abrir esta variante en Google Maps"
              : "Abrir el tramo peatonal en Google Maps"}
            <ExternalLink aria-hidden="true" size={15} />
          </a>
        ) : null}
      </div>
    </section>
  );
}
