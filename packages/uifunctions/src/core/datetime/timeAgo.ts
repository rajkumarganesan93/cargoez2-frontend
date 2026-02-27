/**
 * Convert a date into a human-friendly relative time string.
 * Examples: "just now", "5 minutes ago", "2 hours ago", "3 days ago", "2 weeks ago", "3 months ago", "1 year ago", "in 5 minutes", "2 hours ago", "in 2 days"
 * @param date - Date object or ISO string
 * @returns Relative time string
 */
export interface TimeAgoOptions {
  short?: boolean; // if true, use compact format
}

/**
 * Convert a date into a human-friendly relative time string.
 * Supports both past and future dates.
 * Examples:
 *   Long: "5 minutes ago", "in 2 days"
 *   Short: "5m ago", "in 2d"
 */
export const timeAgo = (
  date: Date | string,
  options: TimeAgoOptions = {}
): string => {
  const inputDate = new Date(date);
  const diffMs = inputDate.getTime() - Date.now(); // positive if future, negative if past

  if (isNaN(diffMs)) {
    throw new Error("Invalid date provided to timeAgo");
  }

  const absDiff = Math.abs(diffMs);
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // approximate
  const years = Math.floor(days / 365); // approximate

  const isFuture = diffMs > 0;

  const format = (value: number, unit: string): string => {
    if (options.short) {
      const suffix = isFuture ? "" : " ago";
      return `${isFuture ? "in " : ""}${value}${unit[0]}${suffix}`;
    }
    return `${isFuture ? "in " : ""}${value} ${unit}${value > 1 ? "s" : ""} ${isFuture ? "" : "ago"}`.trim();
  };

  if (seconds < 60) return "just now";
  if (minutes < 60) return format(minutes, "minute");
  if (hours < 24) return format(hours, "hour");
  if (days < 7) return format(days, "day");
  if (weeks < 5) return format(weeks, "week");
  if (months < 12) return format(months, "month");
  return format(years, "year");
};