import { describe, expect, it } from "vitest";

import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsSearchUrl,
} from "./google-maps";

describe("Google Maps search URLs", () => {
  it("builds an official keyless search URL with encoded public text", () => {
    const url = new URL(
      buildGoogleMapsSearchUrl("Madrid Puerta de Atocha–Almudena Grandes"),
    );

    expect(url.origin).toBe("https://www.google.com");
    expect(url.pathname).toBe("/maps/search/");
    expect(url.searchParams.get("api")).toBe("1");
    expect(url.searchParams.get("query")).toBe(
      "Madrid Puerta de Atocha–Almudena Grandes",
    );
  });

  it("rejects empty searches", () => {
    expect(() => buildGoogleMapsSearchUrl("   ")).toThrow(RangeError);
  });
});

describe("Google Maps directions URLs", () => {
  it("builds a keyless walking route through ordered public points", () => {
    const url = new URL(
      buildGoogleMapsDirectionsUrl([
        { latitude: 40.4156, longitude: -3.707256 },
        { latitude: 40.4168, longitude: -3.7001 },
        { latitude: 40.419641, longitude: -3.687922 },
      ]),
    );

    expect(url.origin).toBe("https://www.google.com");
    expect(url.pathname).toBe("/maps/dir/");
    expect(url.searchParams.get("travelmode")).toBe("walking");
    expect(url.searchParams.get("origin")).toBe("40.4156,-3.707256");
    expect(url.searchParams.get("destination")).toBe("40.419641,-3.687922");
    expect(url.searchParams.get("waypoints")).toBe("40.4168,-3.7001");
  });

  it("rejects incomplete or invalid routes", () => {
    expect(() =>
      buildGoogleMapsDirectionsUrl([
        { latitude: 40.4156, longitude: -3.707256 },
      ]),
    ).toThrow(RangeError);
    expect(() =>
      buildGoogleMapsDirectionsUrl([
        { latitude: 95, longitude: -3.707256 },
        { latitude: 40.419641, longitude: -3.687922 },
      ]),
    ).toThrow(RangeError);
  });

});
