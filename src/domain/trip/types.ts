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
