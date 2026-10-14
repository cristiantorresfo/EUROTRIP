import type { LocalDate, LocalTime } from "./types";

const LOCAL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const LOCAL_TIME_PATTERN = /^(\d{2}):(\d{2})$/;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/** Converts a civil date to a stable UTC value without using the browser timezone. */
export function localDateToUtcMilliseconds(localDate: LocalDate): number {
  const match = LOCAL_DATE_PATTERN.exec(localDate);

  if (!match) {
    throw new RangeError(`Invalid local date format: ${localDate}`);
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const monthIndex = Number(monthText) - 1;
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, monthIndex, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== monthIndex ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError(`Invalid local date value: ${localDate}`);
  }

  return date.getTime();
}

/** Counts calendar nights. The checkout date is an exclusive boundary. */
export function differenceInLocalDates(start: LocalDate, end: LocalDate): number {
  const difference =
    (localDateToUtcMilliseconds(end) - localDateToUtcMilliseconds(start)) /
    MILLISECONDS_PER_DAY;

  if (difference < 0) {
    throw new RangeError(`End date ${end} is before start date ${start}`);
  }

  return difference;
}

export function enumerateLocalDates(
  start: LocalDate,
  endInclusive: LocalDate,
): LocalDate[] {
  const startMilliseconds = localDateToUtcMilliseconds(start);
  const endMilliseconds = localDateToUtcMilliseconds(endInclusive);

  if (endMilliseconds < startMilliseconds) {
    throw new RangeError(`End date ${endInclusive} is before start date ${start}`);
  }

  const dates: LocalDate[] = [];

  for (
    let current = startMilliseconds;
    current <= endMilliseconds;
    current += MILLISECONDS_PER_DAY
  ) {
    dates.push(new Date(current).toISOString().slice(0, 10) as LocalDate);
  }

  return dates;
}

export function localTimeToMinutes(localTime: LocalTime): number {
  const match = LOCAL_TIME_PATTERN.exec(localTime);

  if (!match) {
    throw new RangeError(`Invalid local time format: ${localTime}`);
  }

  const [, hoursText, minutesText] = match;
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (hours > 23 || minutes > 59) {
    throw new RangeError(`Invalid local time value: ${localTime}`);
  }

  return hours * 60 + minutes;
}

export function localDateInTimeZone(date: Date, timeZone: string): LocalDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new RangeError(`Could not resolve a local date for ${timeZone}`);
  }

  return `${year}-${month}-${day}` as LocalDate;
}

export function isLocalDateWithinRange(
  localDate: LocalDate,
  start: LocalDate,
  endInclusive: LocalDate,
): boolean {
  const value = localDateToUtcMilliseconds(localDate);

  return (
    value >= localDateToUtcMilliseconds(start) &&
    value <= localDateToUtcMilliseconds(endInclusive)
  );
}

/** Compares half-open date intervals: [start, end). */
export function localDateRangesOverlap(
  firstStart: LocalDate,
  firstEnd: LocalDate,
  secondStart: LocalDate,
  secondEnd: LocalDate,
): boolean {
  return (
    localDateToUtcMilliseconds(firstStart) < localDateToUtcMilliseconds(secondEnd) &&
    localDateToUtcMilliseconds(secondStart) < localDateToUtcMilliseconds(firstEnd)
  );
}
