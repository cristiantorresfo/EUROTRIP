import { describe, expect, it } from "vitest";

import { splitMoneyEqually } from "../../domain/trip/money";

import {
  accommodationBudgetReference,
  pendingBudgetCategories,
} from "./budget";

describe("EuroTrip 2027 budget references", () => {
  it("keeps the reported accommodation total consistent for four travelers", () => {
    expect(
      splitMoneyEqually(
        accommodationBudgetReference.reportedTotal,
        accommodationBudgetReference.travelerCount,
      ),
    ).toEqual(accommodationBudgetReference.reportedPerTraveler);
  });

  it("keeps every category without a reported amount explicitly pending", () => {
    expect(pendingBudgetCategories.map((item) => item.category)).toEqual([
      "transport",
      "food",
      "tickets",
      "other",
    ]);
  });
});
