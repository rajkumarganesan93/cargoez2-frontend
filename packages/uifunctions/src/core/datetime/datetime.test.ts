import { describe, it, expect } from "vitest";
import { formatDate } from "./dateUtils";
import { convertTimezone } from "./timezone";
import { timeAgo } from "./timeAgo";

describe("dateUtils", () => {
  it("formats date correctly", () => {
    const result = formatDate("2026-02-16T12:00:00Z", "dd/MM/yyyy");
    expect(result).toBe("16/02/2026");
  });
});

describe("timeAgo with short and long formats", () => {
  it("returns 'just now' for current time", () => {
    expect(timeAgo(new Date())).toBe("just now");
  });

  it("handles past minutes (long)", () => {
    const past = new Date(Date.now() - 5 * 60000);
    expect(timeAgo(past)).toBe("5 minutes ago");
  });

  it("handles past minutes (short)", () => {
    const past = new Date(Date.now() - 5 * 60000);
    expect(timeAgo(past, { short: true })).toBe("5m ago");
  });

  it("handles future days (long)", () => {
    const future = new Date(Date.now() + 3 * 86400000);
    expect(timeAgo(future)).toBe("in 3 days");
  });

  it("handles future days (short)", () => {
    const future = new Date(Date.now() + 3 * 86400000);
    expect(timeAgo(future, { short: true })).toBe("in 3d");
  });

  it("handles years ago (long)", () => {
    const past = new Date(Date.now() - 2 * 365 * 86400000);
    expect(timeAgo(past)).toBe("2 years ago");
  });

  it("handles years ago (short)", () => {
    const past = new Date(Date.now() - 2 * 365 * 86400000);
    expect(timeAgo(past, { short: true })).toBe("2y ago");
  });
});

describe("convertTimezone", () => {
  it("converts UTC to Asia/Kolkata correctly", () => {
    const input = "2026-02-16T12:00:00Z"; // noon UTC
    const result = convertTimezone(input, "UTC", "Asia/Kolkata");

    // Luxon will shift to IST (+5:30), may include milliseconds
    expect(result).toContain("2026-02-16T17:30:00");
  });

  it("converts UTC to America/New_York correctly", () => {
    const input = "2026-02-16T12:00:00Z"; // noon UTC
    const result = convertTimezone(input, "UTC", "America/New_York");

    // EST is UTC-5 in February, may include milliseconds
    expect(result).toContain("2026-02-16T07:00:00");
  });

  it("throws error for invalid zone", () => {
    expect(() =>
      convertTimezone("2026-02-16T12:00:00Z", "UTC", "Invalid/Zone")
    ).toThrow();
  });
});