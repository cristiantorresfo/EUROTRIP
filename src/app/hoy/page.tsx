import { ArrowRight, CalendarClock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { DayOverview } from "@/components/itinerary/day-overview";
import { accommodations } from "@/data/eurotrip-2027/accommodations";
import { tripCalendar } from "@/data/eurotrip-2027/calendar";
import { dailyRoutes } from "@/data/eurotrip-2027/daily-routes";
import { tripDayPlans } from "@/data/eurotrip-2027/day-plans";
import { tripPlaces } from "@/data/eurotrip-2027/places";
import { plannedTransportLegs } from "@/data/eurotrip-2027/transport";
import { euroTrip2027 } from "@/data/eurotrip-2027/trip";
import {
  findAccommodationForNight,
  findCheckInForDate,
  findCheckOutForDate,
  findDailyRouteForDate,
  findDayPlanForDate,
  getTransportLegsForDate,
} from "@/domain/trip/selectors";
import { getRelevantTripLocalDate, getTripTodayState } from "@/domain/trip/today";

export const dynamic = "force-dynamic";

export default function TodayPage() {
  const localDate = getRelevantTripLocalDate(new Date(), euroTrip2027);
  const state = getTripTodayState(localDate, euroTrip2027, tripCalendar);

  if (state.phase === "before") {
    return (
      <div className="today-page">
        <header className="page-heading">
          <span className="page-heading__icon" aria-hidden="true">
            <CalendarClock size={22} />
          </span>
          <div>
            <p className="eyebrow">HOY · PREPARACIÓN</p>
            <h1 className="page-title">El viaje aún no comienza</h1>
            <p className="page-description">
              Esta pantalla cambiará automáticamente al itinerario del día durante
              el viaje.
            </p>
          </div>
        </header>

        <section className="countdown-card">
          <span>{state.daysUntilStart}</span>
          <p>días para salir de Bogotá</p>
          <small>29 de mayo de 2027 · Iberia · 21:40</small>
        </section>

        <Link className="primary-action" href="/itinerario/2027-05-29">
          Ver primer día
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    );
  }

  if (state.phase === "after") {
    return (
      <div className="today-page">
        <section className="completion-card">
          <CheckCircle2 aria-hidden="true" size={28} />
          <p className="eyebrow">VIAJE FINALIZADO</p>
          <h1>EuroTrip 2027 completado</h1>
          <p>Han pasado {state.daysSinceEnd} días desde el regreso.</p>
          <Link href="/itinerario">Revisar itinerario</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="today-page">
      <p className="eyebrow">HOY EN EL VIAJE</p>
      <DayOverview
        day={state.day}
        accommodation={findAccommodationForNight(accommodations, localDate)}
        checkIn={findCheckInForDate(accommodations, localDate)}
        checkOut={findCheckOutForDate(accommodations, localDate)}
        transportLegs={getTransportLegsForDate(plannedTransportLegs, localDate)}
        dayPlan={findDayPlanForDate(tripDayPlans, localDate)}
        dailyRoute={findDailyRouteForDate(dailyRoutes, localDate)}
        places={tripPlaces}
      />
      <Link className="text-link" href={`/itinerario/${localDate}`}>
        Abrir navegación del día
        <ArrowRight aria-hidden="true" size={17} />
      </Link>
    </div>
  );
}
