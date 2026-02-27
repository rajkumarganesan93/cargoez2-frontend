import { DateTime } from "luxon";

/**
 * Convert a date from one timezone to another.
 *
 * @param date - Input date (string or Date)
 * @param fromZone - Source timezone (e.g. "UTC", "America/New_York")
 * @param toZone - Target timezone (e.g. "Asia/Kolkata")
 * @returns ISO string in the target timezone
 */

export const convertTimezone = (
  date: string | Date,
  fromZone: string,
  toZone: string
): string => {
  const dt = DateTime.fromJSDate(new Date(date), { zone: fromZone }).setZone(toZone);

  if (!dt.isValid) {
    throw new Error(`Invalid date or timezone: ${date}, ${fromZone} → ${toZone}`);
  }

  return dt.toISO()!; // safe because we checked validity
};

