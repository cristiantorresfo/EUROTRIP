import { describe, expect, it } from "vitest";

import { formatMoney, splitMoneyEqually } from "./money";

describe("money helpers", () => {
  it("formats COP and EUR without converting between currencies", () => {
    expect(formatMoney({ amount: 10_061_140, currency: "COP" })).toBe(
      "COP 10.061.140",
    );
    expect(formatMoney({ amount: 125.5, currency: "EUR" })).toBe("EUR 125,50");
  });

  it("splits a reported total while preserving its currency", () => {
    expect(
      splitMoneyEqually({ amount: 10_061_140, currency: "COP" }, 4),
    ).toEqual({ amount: 2_515_285, currency: "COP" });
  });

  it("rejects an invalid traveler count", () => {
    expect(() =>
      splitMoneyEqually({ amount: 100, currency: "EUR" }, 0),
    ).toThrow(RangeError);
  });
});
