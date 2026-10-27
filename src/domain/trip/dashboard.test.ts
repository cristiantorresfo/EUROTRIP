import { describe, expect, it } from "vitest";

import { tripCalendar } from "../../data/eurotrip-2027/calendar";
import { tripDayPlans } from "../../data/eurotrip-2027/day-plans";
import { bookedTransportLegs } from "../../data/eurotrip-2027/transport";
import { euroTrip2027 } from "../../data/eurotrip-2027/trip";
import { getDashboardNextItem, getItineraryProgress } from "./dashboard";

describe("dashboard summary", () => {
  it("shows the purchased outbound flight before the trip", () => {
    expect(
      getDashboardNextItem(
        "2026-10-14",
        euroTrip2027,
        bookedTransportLegs,
        tripDayPlans,
      ),
    ).toMatchObject({
      kind: "booked_transport",
      localDate: "2027-05-29",
      title: "Bogotá → Madrid",
      status: "confirmed",
    });
  });

  it("shows the first untimed block of the current travel day", () => {
    expect(
      getDashboardNextItem(
        "2027-06-03",
        euroTrip2027,
        bookedTransportLegs,
        tripDayPlans,
      ),
    ).toMatchObject({
      kind: "activity",
      localDate: "2027-06-03",
      title: "Sagrada Família",
      status: "to_verify",
    });
  });

  it("returns no next item after the trip", () => {
    expect(
      getDashboardNextItem(
        "2027-06-20",
        euroTrip2027,
        bookedTransportLegs,
        tripDayPlans,
      ),
    ).toBeNull();
  });

  it("reports draft coverage without treating activities as reservations", () => {
    expect(getItineraryProgress(tripCalendar, tripDayPlans)).toEqual({
      coveredDayCount: 15,
      totalDayCount: 17,
      activityCount: 54,
      recoveryBlockCount: 17,
      reservedActivityCount: 0,
      coveragePercentage: 88,
    });
  });
});
