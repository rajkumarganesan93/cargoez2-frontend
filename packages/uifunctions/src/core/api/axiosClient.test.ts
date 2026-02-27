import { describe, it, expect } from "vitest";
import { api, configureClient } from "./axiosClient";

describe("axiosClient library", () => {
  it("should expose grouped methods", () => {
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
    expect(api.put).toBeDefined();
    expect(api.del).toBeDefined();
  });

  it("should allow configuring the client", () => {
    // Just ensure configureClient is callable
    expect(typeof configureClient).toBe("function");
  });
});