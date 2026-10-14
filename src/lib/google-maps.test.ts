import { describe, expect, it } from "vitest";

import { buildGoogleMapsSearchUrl } from "./google-maps";

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
