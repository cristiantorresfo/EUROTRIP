import { describe, expect, it } from "vitest";

import { tripCalendar } from "../../data/eurotrip-2027/calendar";
import { euroTrip2027 } from "../../data/eurotrip-2027/trip";
import { getRelevantTripLocalDate, getTripTodayState } from "./today";

describe("trip today state", () => {
  it("calculates the pre-trip countdown", () => {
    expect(
      getTripTodayState("2026-10-14", euroTrip2027, tripCalendar),
    ).toEqual({ phase: "before", daysUntilStart: 227 });
  });

  it("returns the matching day while traveling", () => {
    const state = getTripTodayState(
      "2027-06-08",
      euroTrip2027,
      tripCalendar,
    );

    expect(state.phase).toBe("during");
    if (state.phase === "during") {
      expect(state.day.locationLabel).toBe("Venecia");
      expect(state.day.baseCity).toBe("Bolonia");
    }
  });

  it("reports when the trip has finished", () => {
    expect(
      getTripTodayState("2027-06-20", euroTrip2027, tripCalendar),
    ).toEqual({ phase: "after", daysSinceEnd: 6 });
  });

  it("uses the European date during the trip", () => {
    const instant = new Date("2027-06-07T22:30:00Z");

    expect(getRelevantTripLocalDate(instant, euroTrip2027)).toBe("2027-06-08");
  });

  it("does not start the trip while Bogotá is still on May 28", () => {
    const instant = new Date("2027-05-29T02:00:00Z");

    expect(getRelevantTripLocalDate(instant, euroTrip2027)).toBe("2027-05-28");
  });

  it("keeps the return date until the day ends in Bogotá", () => {
    const instant = new Date("2027-06-15T02:00:00Z");

    expect(getRelevantTripLocalDate(instant, euroTrip2027)).toBe("2027-06-14");
  });
});
