import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DayOverview } from "@/components/itinerary/day-overview";
import { accommodations } from "@/data/eurotrip-2027/accommodations";
import { tripCalendar } from "@/data/eurotrip-2027/calendar";
import { dailyRoutes } from "@/data/eurotrip-2027/daily-routes";
import { tripDayPlans } from "@/data/eurotrip-2027/day-plans";
import { tripPlaces } from "@/data/eurotrip-2027/places";
import { plannedTransportLegs } from "@/data/eurotrip-2027/transport";
import {
  findAccommodationForNight,
  findCheckInForDate,
  findCheckOutForDate,
  findDailyRouteForDate,
  findDayPlanForDate,
  getTransportLegsForDate,
} from "@/domain/trip/selectors";
import type { LocalDate } from "@/domain/trip/types";

interface DayPageProps {
  readonly params: Promise<{ fecha: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return tripCalendar.map((day) => ({ fecha: day.localDate }));
}

export default async function DayPage({ params }: DayPageProps) {
  const { fecha } = await params;
  const dayIndex = tripCalendar.findIndex((day) => day.localDate === fecha);

  if (dayIndex < 0) notFound();

  const day = tripCalendar[dayIndex];
  if (!day) notFound();

  const localDate = day.localDate as LocalDate;
  const previousDay = tripCalendar[dayIndex - 1];
  const nextDay = tripCalendar[dayIndex + 1];

  return (
    <div className="day-page">
      <Link className="back-link" href="/itinerario">
        <ArrowLeft aria-hidden="true" size={17} />
        Calendario completo
      </Link>

      <time className="day-date" dateTime={day.localDate}>
        {new Intl.DateTimeFormat("es-CO", {
          weekday: "long",
          day: "numeric",
          month: "long",
          timeZone: "UTC",
        }).format(new Date(`${day.localDate}T00:00:00Z`))}
      </time>

      <DayOverview
        day={day}
        accommodation={findAccommodationForNight(accommodations, localDate)}
        checkIn={findCheckInForDate(accommodations, localDate)}
        checkOut={findCheckOutForDate(accommodations, localDate)}
        transportLegs={getTransportLegsForDate(plannedTransportLegs, localDate)}
        dayPlan={findDayPlanForDate(tripDayPlans, localDate)}
        dailyRoute={findDailyRouteForDate(dailyRoutes, localDate)}
        places={tripPlaces}
      />

      <nav className="day-pagination" aria-label="Navegación entre días">
        {previousDay ? (
          <Link href={`/itinerario/${previousDay.localDate}`}>
            <ArrowLeft aria-hidden="true" size={17} />
            <span>
              <small>Anterior</small>
              {previousDay.locationLabel}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {nextDay ? (
          <Link href={`/itinerario/${nextDay.localDate}`}>
            <span>
              <small>Siguiente</small>
              {nextDay.locationLabel}
            </span>
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
