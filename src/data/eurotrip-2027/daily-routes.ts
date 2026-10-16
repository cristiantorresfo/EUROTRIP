import type { DailyRoute } from "@/domain/trip/types";

import { madridPlazaMayorToRetiroGeometry } from "./route-geometries";

export const dailyRoutes = [
  {
    id: "route-2027-05-31-madrid",
    dayPlanId: "day-2027-05-31",
    localDate: "2027-05-31",
    title: "Madrid de los Austrias → El Retiro",
    status: "routed",
    stops: [
      {
        id: "route-2027-05-31-plaza-mayor",
        activityId: "2027-05-31-madrid-austrias",
        placeId: "madrid-plaza-mayor",
        label: "Plaza Mayor",
        order: 1,
      },
      {
        id: "route-2027-05-31-retiro",
        activityId: "2027-05-31-retiro",
        placeId: "madrid-retiro",
        label: "Puerta de la Independencia · El Retiro",
        order: 2,
      },
    ],
    segments: [
      {
        id: "route-2027-05-31-plaza-mayor-retiro",
        fromStopId: "route-2027-05-31-plaza-mayor",
        toStopId: "route-2027-05-31-retiro",
        mode: "walk",
        routingStatus: "verified",
        distanceMeters: 2023,
        durationMinutes: 27,
        geometry: {
          type: "LineString",
          coordinates: madridPlazaMayorToRetiroGeometry,
        },
        sourceUrl:
          "https://valhalla.github.io/valhalla/api/route/api-reference/",
        verifiedAt: "2026-10-16",
      },
    ],
    notes:
      "La pausa de almuerzo se conserva entre ambas visitas. El lugar exacto se elegirá durante el viaje y no se usa como punto geográfico.",
  },
] as const satisfies readonly DailyRoute[];
