import { ArrowRightLeft, Plane, TrainFront } from "lucide-react";

import type {
  PlanningStatus,
  TransportLeg,
} from "@/domain/trip/types";

const locationLabels: Record<string, string> = {
  bogota: "Bogotá",
  madrid: "Madrid",
  toledo: "Toledo",
  barcelona: "Barcelona",
  paris: "París",
  bologna: "Bolonia",
  venice: "Venecia",
  florence: "Florencia",
  rome: "Roma",
};

const statusLabels: Record<PlanningStatus, string> = {
  confirmed: "Confirmado",
  planned: "Planeado",
  estimated: "Estimado",
  tentative: "Tentativo",
  to_verify: "Por verificar",
};

interface TransportLegCardProps {
  readonly leg: TransportLeg;
}

function getLocalDepartureTime(dateTime: string): string {
  return dateTime.slice(11, 16);
}

export function TransportLegCard({ leg }: TransportLegCardProps) {
  const Icon =
    leg.mode === "flight"
      ? Plane
      : leg.mode === "train"
        ? TrainFront
        : ArrowRightLeft;
  const origin = locationLabels[leg.originId] ?? leg.originId;
  const destination = locationLabels[leg.destinationId] ?? leg.destinationId;

  return (
    <article className="transport-card">
      <span className="transport-card__icon" aria-hidden="true">
        <Icon size={21} />
      </span>

      <div className="transport-card__content">
        <div className="transport-card__topline">
          <h3>
            {origin} → {destination}
          </h3>
          <span className="status-badge" data-status={leg.planningStatus}>
            {statusLabels[leg.planningStatus]}
          </span>
        </div>

        {leg.bookingStatus === "booked" ? (
          <dl className="transport-card__facts">
            <div>
              <dt>Reserva</dt>
              <dd>Comprada</dd>
            </div>
            <div>
              <dt>Salida local</dt>
              <dd>
                <time dateTime={leg.actualDepartureAt}>
                  {getLocalDepartureTime(leg.actualDepartureAt)}
                </time>
              </dd>
            </div>
            <div>
              <dt>Aeropuerto salida</dt>
              <dd>{leg.actualAirportOrStation ?? "Por confirmar"}</dd>
            </div>
          </dl>
        ) : (
          <div className="transport-card__window">
            <span>Ventana objetivo de salida</span>
            <strong>
              {leg.preferredDepartureWindow.start}–
              {leg.preferredDepartureWindow.end}
            </strong>
            <small>No reservado · comparar servicios reales de 2027</small>
          </div>
        )}

        {leg.notes ? <p>{leg.notes}</p> : null}
      </div>
    </article>
  );
}
