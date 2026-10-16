import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import manifest from "./manifest";

describe("PWA manifest", () => {
  it("declares an installable standalone application", () => {
    const value = manifest();

    expect(value).toMatchObject({
      name: "EuroTrip 2027",
      short_name: "EuroTrip",
      start_url: "/",
      scope: "/",
      display: "standalone",
      theme_color: "#ff385c",
      background_color: "#f7f7f7",
    });
  });

  it("provides regular and maskable icons", () => {
    const icons = manifest().icons ?? [];
    const purposes = valuePurposes(icons);

    expect(purposes).toContain("any");
    expect(purposes).toContain("maskable");

    for (const icon of icons) {
      expect(existsSync(join(process.cwd(), "public", icon.src))).toBe(true);
    }
  });
});

function valuePurposes(
  icons: NonNullable<ReturnType<typeof manifest>["icons"]>,
): string[] {
  return icons.flatMap((icon) => icon.purpose?.split(" ") ?? []);
}
