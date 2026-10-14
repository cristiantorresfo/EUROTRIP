import {
  differenceInLocalDates,
  isLocalDateWithinRange,
  localDateInTimeZone,
} from "./dates";
import type { LocalDate, Trip, TripDaySummary } from "./types";

export type TripTodayState =
  | { readonly phase: "before"; readonly daysUntilStart: number }
  | { readonly phase: "during"; readonly day: TripDaySummary }
  | { readonly phase: "after"; readonly daysSinceEnd: number };

export function getRelevantTripLocalDate(date: Date, trip: Trip): LocalDate {
  const bogotaDate = localDateInTimeZone(date, "America/Bogota");

  if (bogotaDate <= trip.startDate) {
    return bogotaDate;
  }

  const europeDate = localDateInTimeZone(date, "Europe/Madrid");

  if (isLocalDateWithinRange(europeDate, trip.startDate, trip.endDate)) {
    return europeDate;
  }

  return bogotaDate;
}

export function getTripTodayState(
  localDate: LocalDate,
  trip: Trip,
  calendar: readonly TripDaySummary[],
): TripTodayState {
  if (localDate < trip.startDate) {
    return {
      phase: "before",
      daysUntilStart: differenceInLocalDates(localDate, trip.startDate),
    };
  }

  if (localDate > trip.endDate) {
    return {
      phase: "after",
      daysSinceEnd: differenceInLocalDates(trip.endDate, localDate),
    };
  }

  const day = calendar.find((calendarDay) => calendarDay.localDate === localDate);

  if (!day) {
    throw new RangeError(`Missing calendar day for ${localDate}`);
  }

  return { phase: "during", day };
}
