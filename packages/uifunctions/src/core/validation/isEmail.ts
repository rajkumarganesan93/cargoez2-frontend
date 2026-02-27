/**
 * Validate if a string is a valid email address.
 */
export const isEmail = (str: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);