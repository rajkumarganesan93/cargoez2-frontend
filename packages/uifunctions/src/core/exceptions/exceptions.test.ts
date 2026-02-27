import { describe, it, expect } from "vitest";
import { safeExecute, logError, formatError } from "./index";

describe("exceptions utilities", () => {
  it("executes safely and returns result", () => {
    const { result, error } = safeExecute(() => 42);
    expect(result).toBe(42);
    expect(error).toBeUndefined();
  });

  it("executes safely and catches error", () => {
    const { result, error } = safeExecute(() => {
      throw new Error("Boom!");
    });
    expect(result).toBeUndefined();
    expect(error?.message).toBe("Boom!");
  });

  it("formats errors correctly", () => {
    const err = new Error("Something went wrong");
    expect(formatError(err)).toContain("Error: Something went wrong");
    expect(formatError("plain string")).toBe("plain string");
  });

  it("logs errors without throwing", () => {
    expect(() => logError(new Error("Log test"), "TestContext")).not.toThrow();
  });
});