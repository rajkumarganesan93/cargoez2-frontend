/**
 * Capitalize the first letter of a string.
 */
export const capitalize = (str: string): string =>
  str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;