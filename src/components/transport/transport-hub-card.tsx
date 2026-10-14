import { ExternalLink, MapPin, Plane, TrainFront } from "lucide-react";

import type { TransportHubReference } from "@/data/eurotrip-2027/transport-hubs";
import { buildGoogleMapsSearchUrl } from "@/lib/google-maps";

interface TransportHubCardProps {
  readonly reference: TransportHubReference;
}

export function TransportHubCard({ reference }: TransportHubCardProps) {
  const { place } = reference;
  const Icon = place.category === "airport" ? Plane : TrainFront;
  const statusLabel =
    reference.planningStatus === "confirmed" ? "Confirmado" : "Por verificar";

  return (
    <article className="transport-hub-card">
      <div className="transport-hub-card__topline">
        <span className="transport-hub-card__icon" aria-hidden="true">
          <Icon size={19} />
        </span>
        <span className="status-badge" data-status={reference.planningStatus}>
          {statusLabel}
        </span>
      </div>

      <span className="transport-hub-card__city">
        <MapPin aria-hidden="true" size={13} />
        {place.city}
      </span>
      <h3>{place.title}</h3>
      <p>{reference.context}</p>

      <a
        className="maps-link"
        href={buildGoogleMapsSearchUrl(reference.googleMapsQuery)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir en Google Maps
        <ExternalLink aria-hidden="true" size={15} />
      </a>
    </article>
  );
}
