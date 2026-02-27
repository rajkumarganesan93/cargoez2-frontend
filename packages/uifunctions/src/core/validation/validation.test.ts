import { describe, it, expect } from "vitest";
import { isEmail, isEmpty } from "./index";

describe("validation utilities", () => {
  it("validates email addresses correctly", () => {
    expect(isEmail("test@example.com")).toBe(true);
    expect(isEmail("invalid-email")).toBe(false);
    expect(isEmail("user@domain")).toBe(false);
  });

  it("detects empty values correctly", () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty("")).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);

    expect(isEmpty("hello")).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});