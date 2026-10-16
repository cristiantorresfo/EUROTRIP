import { ExternalLink, Footprints, Map, MapPinCheck } from "lucide-react";

import { DailyRouteMap } from "@/components/itinerary/daily-route-map";
import type { DailyRoute, Place } from "@/domain/trip/types";
import { buildGoogleMapsDirectionsUrl } from "@/lib/google-maps";

interface DailyRoutePreviewProps {
  readonly route: DailyRoute;
  readonly places: readonly Place[];
}

export function DailyRoutePreview({ route, places }: DailyRoutePreviewProps) {
  const resolvedStops = route.stops.flatMap((stop) => {
    const place = places.find((candidate) => candidate.id === stop.placeId);

    return place?.geoCoordinates
      ? [{ stop, coordinates: place.geoCoordinates }]
      : [];
  });
  const directionsUrl =
    resolvedStops.length === route.stops.length && resolvedStops.length >= 2
      ? buildGoogleMapsDirectionsUrl(
          resolvedStops.map(({ coordinates }) => coordinates),
        )
      : null;
  const routedSegment = route.segments.find(
    (segment) => segment.routingStatus === "verified",
  );

  return (
    <section className="day-section" aria-labelledby="daily-route-heading">
      <div className="section-heading">
        <Map aria-hidden="true" size={19} />
        <div>
          <h2 id="daily-route-heading">Recorrido piloto</h2>
          <p>Mapa y tramo peatonal calculados con datos públicos.</p>
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

        {routedSegment && resolvedStops.length === route.stops.length ? (
          <>
            <dl className="route-preview__facts">
              <div>
                <dt>Distancia</dt>
                <dd>{(routedSegment.distanceMeters / 1000).toFixed(1)} km</dd>
              </div>
              <div>
                <dt>Tiempo a pie</dt>
                <dd>≈ {routedSegment.durationMinutes} min</dd>
              </div>
              <div>
                <dt>Consultado</dt>
                <dd>16 oct. 2026</dd>
              </div>
            </dl>
            <DailyRouteMap
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
                <h4>{stop.label}</h4>
                <p>
                  <MapPinCheck aria-hidden="true" size={13} />
                  Coordenada pública verificada
                </p>
                <a
                  href={coordinates.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver fuente
                  <ExternalLink aria-hidden="true" size={12} />
                </a>
              </div>
            </li>
          ))}
        </ol>

        {route.notes ? <p className="route-preview__note">{route.notes}</p> : null}

        {routedSegment ? (
          <p className="route-preview__source">
            Ruta orientativa calculada con Valhalla y datos de OpenStreetMap. No
            reemplaza señalización, cierres ni condiciones reales del día.
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
            Abrir orden en Google Maps
            <ExternalLink aria-hidden="true" size={15} />
          </a>
        ) : null}
      </div>
    </section>
  );
}
