import { describe, it, expect } from "vitest";
import { capitalize, truncate, slugify } from "./index";

describe("text utilities", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("")).toBe("");
  });

  it("truncates long strings", () => {
    expect(truncate("Hello World", 5)).toBe("Hello...");
    expect(truncate("Hi", 5)).toBe("Hi");
  });

  it("slugifies strings", () => {
    expect(slugify("Hello World Example")).toBe("hello-world-example");
    expect(slugify("Clean & Simple!")).toBe("clean-simple");
  });
});