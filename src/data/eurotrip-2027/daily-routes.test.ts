import { describe, expect, it } from "vitest";

import { dailyRoutes } from "./daily-routes";
import { tripDayPlans } from "./day-plans";
import { tripPlaces } from "./places";
import { accommodationAddresses } from "./accommodation-addresses";

describe("EuroTrip 2027 daily routes", () => {
  const toMinutes = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    return (hours ?? 0) * 60 + (minutes ?? 0);
  };

  it("stores the first seven adaptive daily routes", () => {
    expect(dailyRoutes).toHaveLength(7);
    expect(dailyRoutes.map(({ localDate }) => localDate)).toEqual([
      "2027-05-30",
      "2027-05-31",
      "2027-06-01",
      "2027-06-02",
      "2027-06-03",
      "2027-06-04",
      "2027-06-05",
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

    const dayTwoRoute = dailyRoutes[1];

    expect(dayTwoRoute).toMatchObject({
      dayPlanId: "day-2027-05-31",
      defaultOptionId: "complete",
      switchDuringRoute: true,
    });
    expect(dayTwoRoute?.options.map(({ id }) => id)).toEqual([
      "relaxed",
      "complete",
    ]);
    expect(dayTwoRoute?.options.map(({ stops }) => stops.length)).toEqual([
      10, 13,
    ]);
    expect(
      dayTwoRoute?.options.map(({ segments }) => ({
        distanceMeters: segments[0]?.distanceMeters,
        durationMinutes: segments[0]?.durationMinutes,
      })),
    ).toEqual([
      { distanceMeters: 5411, durationMinutes: 71 },
      { distanceMeters: 8148, durationMinutes: 105 },
    ]);

    const dayThreeRoute = dailyRoutes[2];

    expect(dayThreeRoute).toMatchObject({
      dayPlanId: "day-2027-06-01",
      defaultOptionId: "complete",
      switchDuringRoute: true,
    });
    expect(dayThreeRoute?.options.map(({ id }) => id)).toEqual([
      "relaxed",
      "complete",
    ]);
    expect(dayThreeRoute?.options.map(({ stops }) => stops.length)).toEqual([
      13, 16,
    ]);
    expect(
      dayThreeRoute?.options.map(({ segments }) => {
        const walkingSegment = segments.find(
          (segment) => segment.routingStatus === "verified",
        );

        return {
          distanceMeters: walkingSegment?.distanceMeters,
          durationMinutes: walkingSegment?.durationMinutes,
        };
      }),
    ).toEqual([
      { distanceMeters: 2059, durationMinutes: 27 },
      { distanceMeters: 2743, durationMinutes: 36 },
    ]);

    const dayFourRoute = dailyRoutes[3];

    expect(dayFourRoute).toMatchObject({
      dayPlanId: "day-2027-06-02",
      defaultOptionId: "complete",
      switchDuringRoute: true,
    });
    expect(dayFourRoute?.options.map(({ id }) => id)).toEqual([
      "relaxed",
      "complete",
    ]);
    expect(dayFourRoute?.options.map(({ stops }) => stops.length)).toEqual([
      17, 19,
    ]);
    expect(
      dayFourRoute?.options.map(({ segments }) => {
        const walkingSegment = segments.find(
          (segment) => segment.routingStatus === "verified",
        );

        return {
          distanceMeters: walkingSegment?.distanceMeters,
          durationMinutes: walkingSegment?.durationMinutes,
        };
      }),
    ).toEqual([
      { distanceMeters: 3335, durationMinutes: 41 },
      { distanceMeters: 5125, durationMinutes: 63 },
    ]);

    const dayFiveRoute = dailyRoutes[4];

    expect(dayFiveRoute).toMatchObject({
      dayPlanId: "day-2027-06-03",
      defaultOptionId: "relaxed",
      switchDuringRoute: true,
    });
    expect(dayFiveRoute?.options.map(({ id }) => id)).toEqual([
      "relaxed",
      "complete",
    ]);
    expect(dayFiveRoute?.options.map(({ stops }) => stops.length)).toEqual([
      9, 11,
    ]);
    expect(
      dayFiveRoute?.options.map(({ segments }) =>
        segments
          .filter((segment) => segment.routingStatus === "verified")
          .map(({ distanceMeters, durationMinutes }) => ({
            distanceMeters,
            durationMinutes,
          })),
      ),
    ).toEqual([
      [{ distanceMeters: 543, durationMinutes: 7 }],
      [
        { distanceMeters: 543, durationMinutes: 7 },
        { distanceMeters: 1066, durationMinutes: 15 },
      ],
    ]);
    expect(
      dayFiveRoute?.options.map((option) =>
        "choiceLabel" in option ? option.choiceLabel : undefined,
      ),
    ).toEqual(["Terminamos con calma", "Añadimos Montjuïc"]);

    const daySixRoute = dailyRoutes[5];

    expect(daySixRoute).toMatchObject({
      dayPlanId: "day-2027-06-04",
      defaultOptionId: "batobus_evening",
      switchDuringRoute: true,
    });
    expect(daySixRoute?.options.map(({ id }) => id)).toEqual([
      "batobus_evening",
      "relaxed",
    ]);
    expect(daySixRoute?.options.map(({ stops }) => stops.length)).toEqual([
      10, 9,
    ]);
    expect(
      daySixRoute?.options.map(({ segments }) => {
        const walkingSegment = segments.find(
          (segment) => segment.routingStatus === "verified",
        );

        return {
          distanceMeters: walkingSegment?.distanceMeters,
          durationMinutes: walkingSegment?.durationMinutes,
          coordinateCount: walkingSegment?.geometry?.coordinates.length,
        };
      }),
    ).toEqual([
      { distanceMeters: 2012, durationMinutes: 27, coordinateCount: 141 },
      { distanceMeters: 2016, durationMinutes: 27, coordinateCount: 154 },
    ]);

    const daySevenRoute = dailyRoutes[6];

    expect(daySevenRoute).toMatchObject({
      dayPlanId: "day-2027-06-05",
      defaultOptionId: "complete",
      switchDuringRoute: true,
    });
    expect(daySevenRoute?.options.map(({ id }) => id)).toEqual([
      "complete",
      "relaxed",
    ]);
    expect(daySevenRoute?.options.map(({ stops }) => stops.length)).toEqual([
      11, 9,
    ]);
    expect(
      daySevenRoute?.options.map(({ segments }) =>
        segments
          .filter((segment) => segment.routingStatus === "verified")
          .map(({ distanceMeters, durationMinutes }) => ({
            distanceMeters,
            durationMinutes,
          })),
      ),
    ).toEqual([
      [
        { distanceMeters: 709, durationMinutes: 10 },
        { distanceMeters: 139, durationMinutes: 2 },
        { distanceMeters: 1801, durationMinutes: 22 },
        { distanceMeters: 1077, durationMinutes: 14 },
      ],
      [
        { distanceMeters: 139, durationMinutes: 2 },
        { distanceMeters: 1077, durationMinutes: 14 },
      ],
    ]);
    expect(
      daySevenRoute?.options.map((option) =>
        "choiceLabel" in option ? option.choiceLabel : undefined,
      ),
    ).toEqual([
      "Recorremos París de este a oeste",
      "Conservamos los cuatro imprescindibles",
    ]);
  });

  it("starts at the current lodging and finishes at the lodging for that night", () => {
    for (const route of dailyRoutes) {
      for (const option of route.options) {
        expect(option.stops[0]?.placeId).toBe(
          route.localDate === "2027-06-03" || route.localDate === "2027-06-04"
            ? "barcelona-hospitalet-accommodation-area"
            : route.localDate === "2027-06-05"
              ? "paris-rue-saint-denis-accommodation"
              : "madrid-airbnb-nunez-de-arce",
        );
        expect(option.stops.at(-1)?.placeId).toBe(
          route.localDate === "2027-06-04" || route.localDate === "2027-06-05"
            ? "paris-rue-saint-denis-accommodation"
            : route.localDate === "2027-06-02" ||
                route.localDate === "2027-06-03"
              ? "barcelona-hospitalet-accommodation-area"
              : "madrid-airbnb-nunez-de-arce",
        );
      }
    }

    expect(dailyRoutes[1]?.options[0]?.segments[0]).toMatchObject({
      distanceMeters: 5411,
      durationMinutes: 71,
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

        let previousWindowEnd = 0;

        for (const stop of option.stops) {
          expect(activityIds.has(stop.activityId)).toBe(true);
          expect(publicPlaceIds.has(stop.placeId)).toBe(true);
          expect(stop.suggestedTimeWindow.source).toBe("planning");

          const windowStart = toMinutes(stop.suggestedTimeWindow.start);
          const windowEnd = toMinutes(stop.suggestedTimeWindow.end);

          expect(windowStart).toBeGreaterThanOrEqual(previousWindowEnd);
          expect(windowEnd).toBeGreaterThan(windowStart);
          previousWindowEnd = windowEnd;
        }
      }
    }
  });

  it("stores sourced pedestrian geometries instead of drawing straight lines", () => {
    for (const route of dailyRoutes) {
      for (const option of route.options) {
        const verifiedSegments = option.segments.filter(
          (segment) => segment.routingStatus === "verified",
        );

        expect(verifiedSegments.length).toBeGreaterThan(0);

        for (const segment of verifiedSegments) {
          expect(segment.distanceMeters).toBeGreaterThan(0);
          expect(segment.durationMinutes).toBeGreaterThan(0);
          expect(segment.geometry.type).toBe("LineString");
          expect(segment.geometry.coordinates.length).toBeGreaterThan(2);
          expect(segment.sourceUrl).toMatch(/^https:\/\/valhalla/);
        }
      }
    }

    for (const route of dailyRoutes.slice(0, 2)) {
      for (const option of route.options) {
        const segment = option.segments.find(
          (candidate) => candidate.routingStatus === "verified",
        );

        if (!segment || segment.routingStatus !== "verified") continue;
        expect(segment.geometry.coordinates[0]).toEqual(
          segment.geometry.coordinates.at(-1),
        );
        expect(segment.fromStopId).toContain("airbnb-start");
        expect(segment.toStopId).toContain("airbnb-return");
      }
    }
  });

  it("exposes every explicitly approved route return destination", () => {
    const serializedRoutes = JSON.stringify(dailyRoutes).toLocaleLowerCase();
    const returnDestinations = dailyRoutes.flatMap(({ options }) =>
      options.flatMap((option) =>
        "returnDestination" in option && option.returnDestination
          ? [option.returnDestination]
          : [],
      ),
    );

    expect(new Set(returnDestinations)).toEqual(
      new Set([
        accommodationAddresses["madrid-centro"],
        accommodationAddresses["barcelona-hospitalet"],
        accommodationAddresses["paris-centro"],
      ]),
    );
    expect(serializedRoutes).not.toContain("private-accommodation:");
  });
});
