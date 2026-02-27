/**
 * Convert a string into a URL-friendly slug.
 */
export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]+/g, "")  // remove non-word chars (except spaces and hyphens)
    .replace(/\s+/g, "-")       // replace spaces with -
    .replace(/-+/g, "-");       // collapse consecutive hyphens