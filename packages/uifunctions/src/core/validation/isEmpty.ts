/**
 * Check if a value is considered empty.
 * - null, undefined, empty string
 * - empty array
 * - empty object
 */
export const isEmpty = (val: unknown): boolean => {
  if (val === null || val === undefined) return true;
  if (typeof val === "string" && val.trim() === "") return true;
  if (Array.isArray(val) && val.length === 0) return true;
  if (typeof val === "object" && Object.keys(val as object).length === 0) return true;
  return false;
};