/**
 * Split an array into chunks of a given size.
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  if (size <= 0) throw new Error("Chunk size must be greater than 0");
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
};