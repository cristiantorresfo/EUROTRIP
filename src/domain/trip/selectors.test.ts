import { describe, expect, it } from "vitest";

import { accommodations } from "../../data/eurotrip-2027/accommodations";
import {
  bookedTransportLegs,
  plannedTransportLegs,
} from "../../data/eurotrip-2027/transport";
import { cityStays, euroTrip2027 } from "../../data/eurotrip-2027/trip";
import {
  differenceInLocalDates,
  localDateRangesOverlap,
  localTimeToMinutes,
} from "./dates";
import {
  findAccommodationForNight,
  findCheckInForDate,
  findCheckOutForDate,
  findOverlappingAccommodationIds,
  getAccommodationNights,
  getTotalNights,
  getTransportLegsForDate,
} from "./selectors";

describe("EuroTrip 2027 accommodations", () => {
  it("contains the six confirmed stays and 15 nights", () => {
    expect(accommodations).toHaveLength(6);
    expect(getTotalNights(accommodations)).toBe(15);
  });

  it("keeps every declared night count consistent with its dates", () => {
    for (const accommodation of accommodations) {
      expect(getAccommodationNights(accommodation)).toBe(accommodation.nights);
      expect(accommodation.status).toBe("confirmed");
      expect(accommodation.checkOutByLocal).toBeNull();
    }
  });

  it("does not overlap consecutive stays", () => {
    expect(findOverlappingAccommodationIds(accommodations)).toEqual([]);
    expect(
      localDateRangesOverlap(
        accommodations[0].checkInDate,
        accommodations[0].checkOutDate,
        accommodations[1].checkInDate,
        accommodations[1].checkOutDate,
      ),
    ).toBe(false);
  });

  it("keeps Madrid as two independent stays", () => {
    const madridStays = cityStays.filter((stay) => stay.city === "Madrid");

    expect(madridStays).toHaveLength(2);
    expect(new Set(madridStays.map((stay) => stay.accommodationId)).size).toBe(2);
  });

  it("uses half-open stay dates for daily accommodation context", () => {
    expect(
      findAccommodationForNight(accommodations, "2027-06-02")?.id,
    ).toBe("barcelona-hospitalet");
    expect(findCheckOutForDate(accommodations, "2027-06-02")?.id).toBe(
      "madrid-centro",
    );
    expect(findCheckInForDate(accommodations, "2027-06-02")?.id).toBe(
      "barcelona-hospitalet",
    );
    expect(findAccommodationForNight(accommodations, "2027-06-14")).toBeUndefined();
  });
});

describe("local civil dates", () => {
  it("counts checkout as an exclusive boundary", () => {
    expect(differenceInLocalDates("2027-05-30", "2027-06-02")).toBe(3);
  });

  it("rejects impossible dates", () => {
    expect(() => differenceInLocalDates("2027-02-30", "2027-03-01")).toThrow(
      RangeError,
    );
  });
});

describe("confirmed and proposed data", () => {
  it("keeps the confirmed trip boundaries and traveler count", () => {
    expect(euroTrip2027).toMatchObject({
      startDate: "2027-05-29",
      endDate: "2027-06-14",
      travelerCount: 4,
    });
  });

  it("never presents planned transport windows as bookings", () => {
    expect(plannedTransportLegs).toHaveLength(11);

    for (const leg of plannedTransportLegs) {
      expect(leg.bookingStatus).toBe("not_booked");
      expect(leg.preferredDepartureWindow.source).toBe("planning");
      expect(
        localTimeToMinutes(leg.preferredDepartureWindow.start),
      ).toBeLessThan(
        localTimeToMinutes(leg.preferredDepartureWindow.end),
      );
      expect(leg.actualDepartureAt).toBeNull();
      expect(leg.actualArrivalAt).toBeNull();
      expect(leg.fareEstimate).toBeNull();
    }
  });

  it("keeps only the two international flights as purchased transport", () => {
    expect(bookedTransportLegs).toHaveLength(2);
    expect(bookedTransportLegs.map((leg) => leg.localDate)).toEqual([
      "2027-05-29",
      "2027-06-14",
    ]);

    for (const leg of bookedTransportLegs) {
      expect(leg.bookingStatus).toBe("booked");
      expect(leg.planningStatus).toBe("confirmed");
      expect(leg.preferredDepartureWindow).toBeNull();
      expect(leg.actualDepartureAt).toMatch(
        /^2027-\d{2}-\d{2}T\d{2}:\d{2}:00[+-]\d{2}:\d{2}$/,
      );
      expect(leg.actualArrivalAt).toBeNull();
      expect(leg.fareEstimate).toBeNull();
    }
  });

  it("keeps booked and planned transport identifiers unique", () => {
    const ids = [...bookedTransportLegs, ...plannedTransportLegs].map(
      (leg) => leg.id,
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("selects only the transport legs planned for a given day", () => {
    const legs = getTransportLegsForDate(plannedTransportLegs, "2027-06-08");

    expect(legs).toHaveLength(2);
    expect(legs.map((leg) => leg.id)).toEqual([
      "bologna-venice-outbound",
      "venice-bologna-return",
    ]);
  });
});
