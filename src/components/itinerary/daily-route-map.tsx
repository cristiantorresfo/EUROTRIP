"use client";

import { useEffect, useRef, useState } from "react";
import {
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
} from "maplibre-gl";

import type { GeoCoordinates, VerifiedRouteSegment } from "@/domain/trip/types";

const OPEN_FREE_MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

setWorkerUrl(
  new URL(
    "maplibre-gl/dist/maplibre-gl-worker.mjs",
    import.meta.url,
  ).toString(),
);

interface RouteMapStop {
  readonly id: string;
  readonly label: string;
  readonly order: number;
  readonly coordinates: GeoCoordinates;
}

interface DailyRouteMapProps {
  readonly label: string;
  readonly stops: readonly RouteMapStop[];
  readonly segment: VerifiedRouteSegment;
}

export function DailyRouteMap({ label, stops, segment }: DailyRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || stops.length < 2) return;

    const bounds = new LngLatBounds();
    for (const [longitude, latitude] of segment.geometry.coordinates) {
      bounds.extend([longitude, latitude]);
    }
    for (const stop of stops) {
      bounds.extend([
        stop.coordinates.longitude,
        stop.coordinates.latitude,
      ]);
    }

    const map = new MapLibreMap({
      container,
      style: OPEN_FREE_MAP_STYLE,
      bounds,
      fitBoundsOptions: { padding: 42 },
    });

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.on("error", () => setFailed(true));
    map.on("load", () => {
      map.addSource("daily-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: segment.geometry.coordinates.map(
              ([longitude, latitude]) => [longitude, latitude],
            ),
          },
        },
      });
      map.addLayer({
        id: "daily-route-line-outline",
        type: "line",
        source: "daily-route",
        paint: {
          "line-color": "#ffffff",
          "line-width": 7,
          "line-opacity": 0.9,
        },
      });
      map.addLayer({
        id: "daily-route-line",
        type: "line",
        source: "daily-route",
        paint: {
          "line-color": "#e61e4d",
          "line-width": 4,
          "line-opacity": 0.95,
        },
      });
    });

    const markerStops = stops.reduce<
      Array<RouteMapStop & { orderLabel: string; popupLabel: string }>
    >((result, stop) => {
      const existingStop = result.find(
        ({ coordinates }) =>
          coordinates.latitude === stop.coordinates.latitude &&
          coordinates.longitude === stop.coordinates.longitude,
      );

      if (existingStop) {
        existingStop.orderLabel = `${existingStop.orderLabel}/${stop.order}`;
        existingStop.popupLabel = `${existingStop.popupLabel} · ${stop.label}`;
        return result;
      }

      result.push({
        ...stop,
        orderLabel: String(stop.order),
        popupLabel: stop.label,
      });
      return result;
    }, []);

    const markers = markerStops.map((stop) => {
      const markerElement = document.createElement("div");
      markerElement.className = `route-map__marker${
        stop.orderLabel.includes("/") ? " route-map__marker--roundtrip" : ""
      }`;
      markerElement.textContent = stop.orderLabel;
      markerElement.setAttribute("aria-label", stop.popupLabel);

      return new Marker({ element: markerElement })
        .setLngLat([
          stop.coordinates.longitude,
          stop.coordinates.latitude,
        ])
        .setPopup(new Popup({ offset: 20 }).setText(stop.popupLabel))
        .addTo(map);
    });

    return () => {
      for (const marker of markers) marker.remove();
      map.remove();
    };
  }, [segment, stops]);

  return (
    <div className="route-map-shell">
      <div
        ref={containerRef}
        className="route-map"
        role="img"
        aria-label={label}
      />
      {failed ? (
        <p className="route-map__fallback">
          El mapa base no pudo cargarse. El orden y el enlace a Google Maps
          siguen disponibles.
        </p>
      ) : null}
    </div>
  );
}
