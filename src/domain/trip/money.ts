import type { Money } from "./types";

export function formatMoney(money: Money, locale = "es-CO") {
  if (!Number.isFinite(money.amount) || money.amount < 0) {
    throw new RangeError("Money amount must be a finite, non-negative number.");
  }

  const fractionDigits = Number.isInteger(money.amount) ? 0 : 2;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
    currencyDisplay: "code",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
    .format(money.amount)
    .replace(/\u00a0/g, " ");
}

export function splitMoneyEqually(total: Money, travelerCount: number): Money {
  if (!Number.isInteger(travelerCount) || travelerCount <= 0) {
    throw new RangeError("Traveler count must be a positive integer.");
  }

  return {
    amount: total.amount / travelerCount,
    currency: total.currency,
  };
}
