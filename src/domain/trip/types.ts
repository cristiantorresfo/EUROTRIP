export type LocalDate = `${number}-${number}-${number}`;
export type LocalTime = `${number}:${number}`;
export type Currency = "COP" | "EUR";
export type BaseCity = "Madrid" | "Barcelona" | "París" | "Bolonia" | "Roma";

export type PlanningStatus =
  | "confirmed"
  | "planned"
  | "estimated"
  | "tentative"
  | "to_verify";

export interface Money {
  readonly amount: number;
  readonly currency: Currency;
}

export interface Trip {
  readonly id: string;
  readonly name: string;
  readonly startDate: LocalDate;
  readonly endDate: LocalDate;
  readonly currencyHome: "COP";
  readonly currencyTrip: "EUR";
  readonly travelerCount: 4;
}

export interface Accommodation {
  readonly id: string;
  readonly city: BaseCity;
  readonly publicArea: string;
  readonly checkInDate: LocalDate;
  readonly checkOutDate: LocalDate;
  readonly checkInFromLocal: LocalTime;
  readonly checkOutByLocal: LocalTime | null;
  readonly nights: number;
  readonly status: "confirmed";
  /** Opaque lookup key only. It must never contain a private address. */
  readonly privateLocationRef: string;
}

export interface CityStay {
  readonly id: string;
  readonly city: BaseCity;
  readonly arrivalDate: LocalDate;
  readonly departureDate: LocalDate;
  readonly accommodationId: Accommodation["id"];
}

export interface GeoCoordinates {
  readonly latitude: number;
  readonly longitude: number;
  readonly verificationStatus: "verified";
  readonly sourceUrl: string;
  readonly verifiedAt: LocalDate;
}

export type PlaceCategory =
  | "attraction"
  | "museum"
  | "restaurant"
  | "station"
  | "airport"
  | "other";

export interface Place {
  readonly id: string;
  readonly city: string;
  readonly title: string;
  readonly geoCoordinates?: GeoCoordinates;
  readonly category: PlaceCategory;
  readonly visitDurationMin: number | null;
  readonly officialUrl?: string;
}

export type ActivityCategory = "visit" | "meal" | "rest" | "transfer" | "other";

export interface Activity {
  readonly id: string;
  readonly dayId: string;
  readonly placeId?: Place["id"];
  readonly title: string;
  readonly category: ActivityCategory;
  readonly startsAtLocal: LocalTime | null;
  readonly endsAtLocal: LocalTime | null;
  /** Flexible planning window; it is not a reservation or confirmed opening time. */
  readonly suggestedTimeWindow: LocalTimeWindow;
  readonly expectedDurationMinutes: number;
  readonly fixedReservation: boolean;
  readonly order: number;
  readonly notes?: string;
  readonly status: PlanningStatus;
}

export interface DayPlan {
  readonly id: string;
  readonly localDate: LocalDate;
  readonly baseCity: BaseCity;
  readonly suggestedDayTrip?: string;
  readonly plannedActivities: readonly Activity[];
  readonly status: PlanningStatus;
}

export type RouteTravelMode =
  | "walk"
  | "metro"
  | "bus"
  | "train"
  | "taxi"
  | "other";
export type DailyRouteStatus = "draft" | "routed" | "verified";
export type RouteIntensity = "low" | "medium" | "high";
export type RouteStopPriority = "low" | "medium" | "high";

export interface RouteStop {
  readonly id: string;
  readonly activityId: Activity["id"];
  readonly placeId: Place["id"];
  readonly label: string;
  readonly order: number;
  readonly priority?: RouteStopPriority;
  readonly estimatedVisitMinutes?: number;
  /** Flexible planning window; it may change when tickets or transport are booked. */
  readonly suggestedTimeWindow?: LocalTimeWindow;
  /** False keeps long-distance transfer stops out of the focused local map. */
  readonly mapVisible?: boolean;
  readonly optional?: boolean;
  readonly visitMode?: "exterior" | "walk_through";
  readonly preferredMoment?: "sunset";
  readonly highlights?: readonly string[];
  readonly notes?: string;
}

export interface PendingRouteSegment {
  readonly id: string;
  readonly fromStopId: RouteStop["id"];
  readonly toStopId: RouteStop["id"];
  readonly mode: RouteTravelMode;
  readonly label?: string;
  readonly notes?: string;
  readonly routingStatus: "pending";
  readonly distanceMeters: null;
  readonly durationMinutes: null;
  readonly geometry: null;
  readonly sourceUrl: null;
  readonly verifiedAt: null;
}

export interface VerifiedRouteSegment {
  readonly id: string;
  readonly fromStopId: RouteStop["id"];
  readonly toStopId: RouteStop["id"];
  readonly mode: RouteTravelMode;
  readonly label?: string;
  readonly notes?: string;
  readonly routingStatus: "verified";
  readonly distanceMeters: number;
  readonly durationMinutes: number;
  readonly geometry: {
    readonly type: "LineString";
    /** GeoJSON order: longitude, latitude. */
    readonly coordinates: readonly (readonly [number, number])[];
  };
  readonly sourceUrl: string;
  readonly verifiedAt: LocalDate;
}

export type RouteSegment = PendingRouteSegment | VerifiedRouteSegment;

export interface DailyRouteOption {
  readonly id: string;
  readonly name: string;
  readonly recommendedWhen: string;
  readonly intensity: RouteIntensity;
  /** Human-readable total including visits and pauses, not only walking. */
  readonly estimatedDuration: string;
  readonly stops: readonly RouteStop[];
  readonly segments: readonly RouteSegment[];
  readonly returnRoute?: string;
  readonly returnDestination?: string;
  readonly returnNotes?: string;
}

export interface DailyRoute {
  readonly id: string;
  readonly dayPlanId: DayPlan["id"];
  readonly localDate: LocalDate;
  readonly title: string;
  readonly status: DailyRouteStatus;
  readonly summary?: string;
  readonly defaultOptionId: DailyRouteOption["id"];
  readonly options: readonly DailyRouteOption[];
  readonly switchDuringRoute: boolean;
  readonly switchRule?: string;
  readonly notes?: string;
}

export type CalendarDayKind = "travel" | "base" | "day_trip";

/** Read model used by the calendar before detailed activities are defined. */
export interface TripDaySummary {
  readonly localDate: LocalDate;
  readonly baseCity: BaseCity | null;
  readonly locationLabel: string;
  readonly title: string;
  readonly detail?: string;
  readonly kind: CalendarDayKind;
  readonly status: PlanningStatus;
}

export type TransportMode = "walk" | "metro" | "bus" | "train" | "flight" | "other";

export interface LocalTimeWindow {
  readonly start: LocalTime;
  readonly end: LocalTime;
  readonly source: "planning";
}

interface TransportLegBase {
  readonly id: string;
  readonly localDate: LocalDate;
  readonly originId: string;
  readonly destinationId: string;
  readonly mode: TransportMode;
  readonly fareEstimate: Money | null;
  readonly planningStatus: PlanningStatus;
  readonly notes?: string;
}

export interface PlannedTransportLeg extends TransportLegBase {
  readonly bookingStatus: "not_booked";
  readonly preferredDepartureWindow: LocalTimeWindow;
  readonly actualDepartureAt: null;
  readonly actualArrivalAt: null;
  readonly actualAirportOrStation: null;
}

export interface BookedTransportLeg extends TransportLegBase {
  readonly bookingStatus: "booked";
  readonly planningStatus: "confirmed";
  readonly preferredDepartureWindow: null;
  /** ISO 8601 datetime including its explicit UTC offset. */
  readonly actualDepartureAt: string;
  readonly actualArrivalAt: string | null;
  readonly actualAirportOrStation: string | null;
}

export type TransportLeg = PlannedTransportLeg | BookedTransportLeg;

export type ExpenseCategory =
  | "accommodation"
  | "transport"
  | "food"
  | "tickets"
  | "other";

export interface ExpenseSplit {
  readonly travelerId: string;
  readonly amount: number;
}

export interface Expense {
  readonly id: string;
  readonly amount: number;
  readonly currency: Currency;
  readonly category: ExpenseCategory;
  readonly paidBy: string;
  readonly splits: readonly ExpenseSplit[];
  readonly paidStatus: "pending" | "paid";
  readonly exchangeRateAtBooking?: {
    readonly copPerUnit: number;
    readonly referenceDate: LocalDate;
  };
}

/**
 * A traveler-reported planning figure. It is intentionally separate from
 * Expense because it does not prove a payment, payer or final split.
 */
export interface BudgetReference {
  readonly id: string;
  readonly category: ExpenseCategory;
  readonly reportedTotal: Money;
  readonly reportedPerTraveler: Money;
  readonly travelerCount: Trip["travelerCount"];
  readonly paymentDueDate: LocalDate | null;
  readonly status: "to_verify";
  readonly notes: string;
}
