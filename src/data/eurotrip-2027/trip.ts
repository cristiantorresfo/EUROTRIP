import type { CityStay, Trip } from "@/domain/trip/types";

export const euroTrip2027 = {
  id: "eurotrip-2027",
  name: "EuroTrip 2027",
  startDate: "2027-05-29",
  endDate: "2027-06-14",
  currencyHome: "COP",
  currencyTrip: "EUR",
  travelerCount: 4,
} as const satisfies Trip;

export const cityStays = [
  {
    id: "madrid-first-stay",
    city: "Madrid",
    arrivalDate: "2027-05-30",
    departureDate: "2027-06-02",
    accommodationId: "madrid-centro",
  },
  {
    id: "barcelona-stay",
    city: "Barcelona",
    arrivalDate: "2027-06-02",
    departureDate: "2027-06-04",
    accommodationId: "barcelona-hospitalet",
  },
  {
    id: "paris-stay",
    city: "París",
    arrivalDate: "2027-06-04",
    departureDate: "2027-06-07",
    accommodationId: "paris-centro",
  },
  {
    id: "bologna-stay",
    city: "Bolonia",
    arrivalDate: "2027-06-07",
    departureDate: "2027-06-10",
    accommodationId: "bologna-centro",
  },
  {
    id: "rome-stay",
    city: "Roma",
    arrivalDate: "2027-06-10",
    departureDate: "2027-06-13",
    accommodationId: "roma-termini",
  },
  {
    id: "madrid-final-stay",
    city: "Madrid",
    arrivalDate: "2027-06-13",
    departureDate: "2027-06-14",
    accommodationId: "madrid-aeropuerto",
  },
] as const satisfies readonly CityStay[];
