import type {
  BookedTransportLeg,
  DayPlan,
  LocalDate,
  PlanningStatus,
  Trip,
  TripDaySummary,
} from "./types";

export type DashboardNextItem =
  | Readonly<{
      kind: "booked_transport";
      localDate: LocalDate;
      title: string;
      detail: string;
      status: "confirmed";
      href: "/traslados";
    }>
  | Readonly<{
      kind: "activity";
      localDate: LocalDate;
      title: string;
      detail: string;
      status: PlanningStatus;
      href: `/itinerario/${LocalDate}`;
    }>;

export interface ItineraryProgress {
  readonly coveredDayCount: number;
  readonly totalDayCount: number;
  readonly activityCount: number;
  readonly recoveryBlockCount: number;
  readonly reservedActivityCount: number;
  readonly coveragePercentage: number;
}

const locationLabels: Readonly<Record<string, string>> = {
  bogota: "Bogotá",
  madrid: "Madrid",
};

function localTimeFromOffsetDateTime(dateTime: string) {
  return dateTime.slice(11, 16);
}

export function getDashboardNextItem(
  localDate: LocalDate,
  trip: Trip,
  bookedTransportLegs: readonly BookedTransportLeg[],
  dayPlans: readonly DayPlan[],
): DashboardNextItem | null {
  if (localDate > trip.endDate) return null;

  const nextBookedTransport = [...bookedTransportLegs]
    .filter((leg) => leg.localDate >= localDate)
    .sort((left, right) => left.localDate.localeCompare(right.localDate))[0];
  const nextDayPlan = [...dayPlans]
    .filter((dayPlan) => dayPlan.localDate >= localDate)
    .sort((left, right) => left.localDate.localeCompare(right.localDate))[0];

  if (
    nextBookedTransport &&
    (!nextDayPlan || nextBookedTransport.localDate <= nextDayPlan.localDate)
  ) {
    const origin =
      locationLabels[nextBookedTransport.originId] ??
      nextBookedTransport.originId;
    const destination =
      locationLabels[nextBookedTransport.destinationId] ??
      nextBookedTransport.destinationId;

    return {
      kind: "booked_transport",
      localDate: nextBookedTransport.localDate,
      title: `${origin} → ${destination}`,
      detail: `Vuelo comprado · salida ${localTimeFromOffsetDateTime(nextBookedTransport.actualDepartureAt)}, hora local`,
      status: "confirmed",
      href: "/traslados",
    };
  }

  const firstActivity = nextDayPlan?.plannedActivities[0];

  if (!nextDayPlan || !firstActivity) return null;

  return {
    kind: "activity",
    localDate: nextDayPlan.localDate,
    title: firstActivity.title,
    detail: `Borrador sin hora · ${firstActivity.expectedDurationMinutes} min de planificación`,
    status: firstActivity.status,
    href: `/itinerario/${nextDayPlan.localDate}`,
  };
}

export function getItineraryProgress(
  calendar: readonly TripDaySummary[],
  dayPlans: readonly DayPlan[],
): ItineraryProgress {
  const calendarDates = new Set(calendar.map((day) => day.localDate));
  const coveredDayCount = new Set(
    dayPlans
      .filter((dayPlan) => calendarDates.has(dayPlan.localDate))
      .map((dayPlan) => dayPlan.localDate),
  ).size;
  const activities = dayPlans.flatMap((dayPlan) => dayPlan.plannedActivities);
  const totalDayCount = calendar.length;

  return {
    coveredDayCount,
    totalDayCount,
    activityCount: activities.length,
    recoveryBlockCount: activities.filter(
      (activity) => activity.category === "rest" || activity.category === "meal",
    ).length,
    reservedActivityCount: activities.filter(
      (activity) => activity.fixedReservation,
    ).length,
    coveragePercentage:
      totalDayCount === 0
        ? 0
        : Math.round((coveredDayCount / totalDayCount) * 100),
  };
}
