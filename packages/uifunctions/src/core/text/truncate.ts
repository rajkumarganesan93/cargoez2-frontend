/**
 * Truncate a string to a given length and append ellipsis if needed.
 */
export const truncate = (str: string, length: number): string =>
  str.length > length ? str.slice(0, length) + "..." : str;