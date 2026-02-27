/**
 * Wrap a function call in try/catch and return either result or error.
 */
export const safeExecute = <T>(fn: () => T): { result?: T; error?: Error } => {
  try {
    return { result: fn() };
  } catch (err) {
    return { error: err as Error };
  }
};