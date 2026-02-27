/**
 * Log an error with optional context.
 */
export const logError = (error: unknown, context?: string): void => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[Error]${context ? " [" + context + "]" : ""}: ${message}`);
};