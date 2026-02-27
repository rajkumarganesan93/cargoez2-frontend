/**
 * Deep clone an object or array using JSON serialization.
 * Note: This will drop functions, undefined, and special object types.
 */
export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));