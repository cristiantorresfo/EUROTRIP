import { differenceInLocalDates, localDateRangesOverlap } from "./dates";
import type {
  Accommodation,
  DailyRoute,
  DayPlan,
  LocalDate,
  PlannedTransportLeg,
} from "./types";

export function findDailyRouteForDate(
  dailyRoutes: readonly DailyRoute[],
  localDate: LocalDate,
): DailyRoute | undefined {
  return dailyRoutes.find((route) => route.localDate === localDate);
}

export function findDayPlanForDate(
  dayPlans: readonly DayPlan[],
  localDate: LocalDate,
): DayPlan | undefined {
  return dayPlans.find((dayPlan) => dayPlan.localDate === localDate);
}

export function getAccommodationNights(accommodation: Accommodation): number {
  return differenceInLocalDates(
    accommodation.checkInDate,
    accommodation.checkOutDate,
  );
}

export function getTotalNights(
  accommodations: readonly Accommodation[],
): number {
  return accommodations.reduce(
    (total, accommodation) => total + getAccommodationNights(accommodation),
    0,
  );
}

export function findOverlappingAccommodationIds(
  accommodations: readonly Accommodation[],
): readonly [string, string][] {
  const overlaps: [string, string][] = [];

  for (let currentIndex = 0; currentIndex < accommodations.length; currentIndex += 1) {
    const current = accommodations[currentIndex];

    if (!current) continue;

    for (
      let comparisonIndex = currentIndex + 1;
      comparisonIndex < accommodations.length;
      comparisonIndex += 1
    ) {
      const comparison = accommodations[comparisonIndex];

      if (
        comparison &&
        localDateRangesOverlap(
          current.checkInDate,
          current.checkOutDate,
          comparison.checkInDate,
          comparison.checkOutDate,
        )
      ) {
        overlaps.push([current.id, comparison.id]);
      }
    }
  }

  return overlaps;
}

export function findAccommodationForNight(
  accommodations: readonly Accommodation[],
  localDate: LocalDate,
): Accommodation | undefined {
  return accommodations.find(
    (accommodation) =>
      localDate >= accommodation.checkInDate &&
      localDate < accommodation.checkOutDate,
  );
}

export function findCheckInForDate(
  accommodations: readonly Accommodation[],
  localDate: LocalDate,
): Accommodation | undefined {
  return accommodations.find(
    (accommodation) => accommodation.checkInDate === localDate,
  );
}

export function findCheckOutForDate(
  accommodations: readonly Accommodation[],
  localDate: LocalDate,
): Accommodation | undefined {
  return accommodations.find(
    (accommodation) => accommodation.checkOutDate === localDate,
  );
}

export function getTransportLegsForDate(
  transportLegs: readonly PlannedTransportLeg[],
  localDate: LocalDate,
): readonly PlannedTransportLeg[] {
  return transportLegs.filter((leg) => leg.localDate === localDate);
}
