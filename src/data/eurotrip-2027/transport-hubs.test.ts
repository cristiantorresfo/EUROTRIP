import { describe, expect, it } from "vitest";

import { transportHubReferences } from "./transport-hubs";

describe("public transport hub references", () => {
  it("keeps only the booked international airports confirmed", () => {
    const confirmed = transportHubReferences.filter(
      (reference) => reference.planningStatus === "confirmed",
    );

    expect(confirmed.map(({ place }) => place.id)).toEqual([
      "airport-bog",
      "airport-mad",
    ]);
  });

  it("contains only public stations and airports without coordinates", () => {
    for (const reference of transportHubReferences) {
      expect(["station", "airport"]).toContain(reference.place.category);
      expect("geoCoordinates" in reference.place).toBe(false);
      expect(reference.googleMapsQuery.trim()).not.toBe("");
    }
  });

  it("keeps every public reference identifier unique", () => {
    const ids = transportHubReferences.map(({ place }) => place.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
