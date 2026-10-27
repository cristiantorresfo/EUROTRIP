import { describe, expect, it } from "vitest";

import { tripDayPlans } from "./day-plans";
import { tripPlaces } from "./places";

describe("EuroTrip 2027 proposed day plans", () => {
  it("covers every non-flight date with at least one recovery block", () => {
    expect(tripDayPlans).toHaveLength(15);

    for (const dayPlan of tripDayPlans) {
      expect(
        dayPlan.plannedActivities.some(
          (activity) => activity.category === "rest" || activity.category === "meal",
        ),
      ).toBe(true);
    }
  });

  it("keeps activities untimed, unbooked and ordered", () => {
    for (const dayPlan of tripDayPlans) {
      const orders = dayPlan.plannedActivities.map((activity) => activity.order);

      expect(orders).toEqual([...orders].sort((left, right) => left - right));
      expect(new Set(orders).size).toBe(orders.length);

      for (const activity of dayPlan.plannedActivities) {
        expect(activity.startsAtLocal).toBeNull();
        expect(activity.endsAtLocal).toBeNull();
        expect(activity.fixedReservation).toBe(false);
        expect(activity.status).not.toBe("confirmed");
      }
    }
  });

  it("references only public places with secure official links", () => {
    const placeIds: ReadonlySet<string> = new Set(
      tripPlaces.map((place) => place.id),
    );

    for (const dayPlan of tripDayPlans) {
      for (const activity of dayPlan.plannedActivities) {
        if (activity.placeId) expect(placeIds.has(activity.placeId)).toBe(true);
      }
    }

    for (const place of tripPlaces) {
      expect(place.officialUrl).toMatch(/^https:\/\//);
    }
  });

  it("limits verified coordinates to public Madrid route stops", () => {
    const geocodedPlaces = tripPlaces.filter(
      (place) => "geoCoordinates" in place,
    );

    expect(geocodedPlaces).toHaveLength(13);

    for (const place of geocodedPlaces) {
      expect(place.city).toBe("Madrid");
      expect(place.geoCoordinates.verificationStatus).toBe("verified");
      expect(place.geoCoordinates.sourceUrl).toMatch(/^https:\/\//);
      expect(["2026-10-16", "2026-10-27"]).toContain(
        place.geoCoordinates.verifiedAt,
      );
      expect(place.geoCoordinates.latitude).toBeGreaterThanOrEqual(-90);
      expect(place.geoCoordinates.latitude).toBeLessThanOrEqual(90);
      expect(place.geoCoordinates.longitude).toBeGreaterThanOrEqual(-180);
      expect(place.geoCoordinates.longitude).toBeLessThanOrEqual(180);
    }
  });
});
