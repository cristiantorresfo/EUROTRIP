import { describe, expect, it } from "vitest";

import { tripCalendar } from "../../data/eurotrip-2027/calendar";
import { euroTrip2027 } from "../../data/eurotrip-2027/trip";
import { enumerateLocalDates } from "./dates";

describe("EuroTrip 2027 calendar", () => {
  it("covers every natural date of the trip exactly once", () => {
    const expectedDates = enumerateLocalDates(
      euroTrip2027.startDate,
      euroTrip2027.endDate,
    );

    expect(tripCalendar.map((day) => day.localDate)).toEqual(expectedDates);
    expect(new Set(expectedDates).size).toBe(17);
  });

  it("keeps Bologna as the base for Venice and Florence", () => {
    const dayTrips = tripCalendar.filter(
      (day) => day.locationLabel === "Venecia" || day.locationLabel === "Florencia",
    );

    expect(dayTrips).toHaveLength(2);
    expect(dayTrips.every((day) => day.baseCity === "Bolonia")).toBe(true);
    expect(dayTrips.every((day) => day.status === "tentative")).toBe(true);
  });

  it("only marks the purchased international flight days as confirmed", () => {
    const confirmedDays = tripCalendar.filter((day) => day.status === "confirmed");

    expect(confirmedDays.map((day) => day.localDate)).toEqual([
      "2027-05-29",
      "2027-06-14",
    ]);
  });
});
