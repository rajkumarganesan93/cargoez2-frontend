import { format } from "date-fns";

/**
 * Format a date into a given pattern.
 * @param date - Date object or ISO string
 * @param pattern - Format string (default: "yyyy-MM-dd")
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  pattern = "yyyy-MM-dd"
): string => {
  return format(new Date(date), pattern);
};