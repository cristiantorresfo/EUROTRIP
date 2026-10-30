import { describe, expect, it } from "vitest";

import { tripDayPlans } from "./day-plans";
import { tripPlaces } from "./places";

describe("EuroTrip 2027 proposed day plans", () => {
  const toMinutes = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    return (hours ?? 0) * 60 + (minutes ?? 0);
  };

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

  it("keeps activities unbooked, ordered and inside planning windows", () => {
    for (const dayPlan of tripDayPlans) {
      const orders = dayPlan.plannedActivities.map((activity) => activity.order);
      let previousWindowEnd = 0;

      expect(orders).toEqual([...orders].sort((left, right) => left - right));
      expect(new Set(orders).size).toBe(orders.length);

      for (const activity of dayPlan.plannedActivities) {
        expect(activity.startsAtLocal).toBeNull();
        expect(activity.endsAtLocal).toBeNull();
        expect(activity.fixedReservation).toBe(false);
        expect(activity.status).not.toBe("confirmed");
        expect(activity.suggestedTimeWindow.source).toBe("planning");

        const windowStart = toMinutes(activity.suggestedTimeWindow.start);
        const windowEnd = toMinutes(activity.suggestedTimeWindow.end);

        expect(windowStart).toBeGreaterThanOrEqual(previousWindowEnd);
        expect(windowEnd).toBeGreaterThan(windowStart);
        previousWindowEnd = windowEnd;
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

  it("limits sourced coordinates to public route stops", () => {
    const geocodedPlaces = tripPlaces.filter(
      (place) => "geoCoordinates" in place,
    );

    expect(geocodedPlaces).toHaveLength(76);

    for (const place of geocodedPlaces) {
      expect([
        "Madrid",
        "Toledo",
        "Barcelona",
        "L’Hospitalet de Llobregat",
        "París",
        "Versalles",
      ]).toContain(place.city);
      expect(["verified", "approximate"]).toContain(
        place.geoCoordinates.verificationStatus,
      );
      expect(place.geoCoordinates.sourceUrl).toMatch(/^https:\/\//);
      expect([
        "2026-10-16",
        "2026-10-27",
        "2026-10-28",
        "2026-10-29",
        "2026-10-30",
      ]).toContain(
        place.geoCoordinates.verifiedAt,
      );
      expect(place.geoCoordinates.latitude).toBeGreaterThanOrEqual(-90);
      expect(place.geoCoordinates.latitude).toBeLessThanOrEqual(90);
      expect(place.geoCoordinates.longitude).toBeGreaterThanOrEqual(-180);
      expect(place.geoCoordinates.longitude).toBeLessThanOrEqual(180);
    }

    const barcelonaAccommodation = tripPlaces.find(
      ({ id }) => id === "barcelona-hospitalet-accommodation-area",
    );

    expect(
      barcelonaAccommodation && "geoCoordinates" in barcelonaAccommodation
        ? barcelonaAccommodation.geoCoordinates
        : undefined,
    ).toMatchObject({
      verificationStatus: "approximate",
      sourceUrl: "https://www.openstreetmap.org/way/650098840",
    });
  });
});
