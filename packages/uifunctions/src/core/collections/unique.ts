/**
 * Return a new array with unique values.
 */
export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];