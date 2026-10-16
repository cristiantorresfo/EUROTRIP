import { describe, expect, it } from "vitest";

import { dailyRoutes } from "./daily-routes";
import { tripDayPlans } from "./day-plans";
import { tripPlaces } from "./places";

describe("EuroTrip 2027 daily routes", () => {
  it("starts with the public Madrid pilot on 31 May", () => {
    expect(dailyRoutes).toHaveLength(1);
    expect(dailyRoutes[0]).toMatchObject({
      localDate: "2027-05-31",
      dayPlanId: "day-2027-05-31",
      status: "routed",
    });
  });

  it("keeps route stops ordered and linked to that day's public activities", () => {
    const route = dailyRoutes[0];
    const dayPlan = tripDayPlans.find(({ id }) => id === route?.dayPlanId);
    const activityIds = new Set(
      dayPlan?.plannedActivities.map(({ id }) => id) ?? [],
    );
    const publicPlaceIds = new Set(tripPlaces.map(({ id }) => id));

    expect(dayPlan?.localDate).toBe(route?.localDate);
    expect(route?.stops.map(({ order }) => order)).toEqual([1, 2]);

    for (const stop of route?.stops ?? []) {
      expect(activityIds.has(stop.activityId)).toBe(true);
      expect(publicPlaceIds.has(stop.placeId)).toBe(true);
    }
  });

  it("stores a sourced pedestrian geometry instead of drawing a straight line", () => {
    const route = dailyRoutes[0];

    expect(route?.segments).toHaveLength((route?.stops.length ?? 1) - 1);

    for (const segment of route?.segments ?? []) {
      expect(segment.routingStatus).toBe("verified");
      expect(segment.distanceMeters).toBe(2023);
      expect(segment.durationMinutes).toBe(27);
      expect(segment.geometry.type).toBe("LineString");
      expect(segment.geometry.coordinates.length).toBeGreaterThan(100);
      expect(segment.sourceUrl).toMatch(/^https:\/\/valhalla/);
      expect(segment.verifiedAt).toBe("2026-10-16");

      expect(segment.geometry.coordinates.length).toBeGreaterThan(2);
    }
  });
});
