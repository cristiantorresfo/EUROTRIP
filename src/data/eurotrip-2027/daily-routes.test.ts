import { describe, expect, it } from "vitest";

import { dailyRoutes } from "./daily-routes";
import { tripDayPlans } from "./day-plans";
import { tripPlaces } from "./places";

describe("EuroTrip 2027 daily routes", () => {
  it("stores an adaptive arrival route and the Madrid pilot", () => {
    expect(dailyRoutes).toHaveLength(2);
    expect(dailyRoutes.map(({ localDate }) => localDate)).toEqual([
      "2027-05-30",
      "2027-05-31",
    ]);

    const arrivalRoute = dailyRoutes[0];

    expect(arrivalRoute).toMatchObject({
      dayPlanId: "day-2027-05-30",
      defaultOptionId: "relaxed",
      switchDuringRoute: true,
    });
    expect(arrivalRoute?.options.map(({ id }) => id)).toEqual([
      "relaxed",
      "complete",
    ]);
    expect(arrivalRoute?.options.map(({ stops }) => stops.length)).toEqual([
      9, 13,
    ]);
    for (const option of arrivalRoute?.options ?? []) {
      expect(option.stops[0]?.placeId).toBe("madrid-airbnb-nunez-de-arce");
      expect(option.stops.at(-1)?.placeId).toBe(
        "madrid-airbnb-nunez-de-arce",
      );
    }
    expect(
      arrivalRoute?.options.map(({ segments }) => ({
        distanceMeters: segments[0]?.distanceMeters,
        durationMinutes: segments[0]?.durationMinutes,
      })),
    ).toEqual([
      { distanceMeters: 5912, durationMinutes: 77 },
      { distanceMeters: 6149, durationMinutes: 80 },
    ]);
  });

  it("starts and finishes every mapped Madrid route at the Airbnb", () => {
    for (const route of dailyRoutes) {
      for (const option of route.options) {
        expect(option.stops[0]?.placeId).toBe("madrid-airbnb-nunez-de-arce");
        expect(option.stops.at(-1)?.placeId).toBe(
          "madrid-airbnb-nunez-de-arce",
        );
      }
    }

    expect(dailyRoutes[1]?.options[0]?.segments[0]).toMatchObject({
      distanceMeters: 4343,
      durationMinutes: 57,
    });
  });

  it("keeps every option ordered and linked to public activities and places", () => {
    const publicPlaceIds = new Set(tripPlaces.map(({ id }) => id));

    for (const route of dailyRoutes) {
      const dayPlan = tripDayPlans.find(({ id }) => id === route.dayPlanId);
      const activityIds = new Set(
        dayPlan?.plannedActivities.map(({ id }) => id) ?? [],
      );

      expect(dayPlan?.localDate).toBe(route.localDate);
      expect(route.options.some(({ id }) => id === route.defaultOptionId)).toBe(
        true,
      );

      for (const option of route.options) {
        expect(option.stops.map(({ order }) => order)).toEqual(
          option.stops.map((_, index) => index + 1),
        );

        for (const stop of option.stops) {
          expect(activityIds.has(stop.activityId)).toBe(true);
          expect(publicPlaceIds.has(stop.placeId)).toBe(true);
        }
      }
    }
  });

  it("stores sourced pedestrian geometries instead of drawing straight lines", () => {
    for (const route of dailyRoutes) {
      for (const option of route.options) {
        expect(option.segments).toHaveLength(1);

        const segment = option.segments[0];

        expect(segment?.routingStatus).toBe("verified");
        if (!segment || segment.routingStatus !== "verified") continue;

        expect(segment.distanceMeters).toBeGreaterThan(0);
        expect(segment.durationMinutes).toBeGreaterThan(0);
        expect(segment.geometry.type).toBe("LineString");
        expect(segment.geometry.coordinates.length).toBeGreaterThan(100);
        expect(segment.sourceUrl).toMatch(/^https:\/\/valhalla/);

        expect(segment.geometry.coordinates[0]).toEqual(
          segment.geometry.coordinates.at(-1),
        );
        expect(segment.fromStopId).toContain("airbnb-start");
        expect(segment.toStopId).toContain("airbnb-return");
      }
    }
  });

  it("exposes only the explicitly approved accommodation return destination", () => {
    const serializedRoutes = JSON.stringify(dailyRoutes).toLocaleLowerCase();
    const returnDestinations = dailyRoutes.flatMap(({ options }) =>
      options.flatMap((option) =>
        "returnDestination" in option && option.returnDestination
          ? [option.returnDestination]
          : [],
      ),
    );

    expect(new Set(returnDestinations)).toEqual(
      new Set(["Calle de Núñez de Arce, 14, 28012 Madrid, España"]),
    );
    expect(serializedRoutes).not.toContain("private-accommodation:");
  });
});
