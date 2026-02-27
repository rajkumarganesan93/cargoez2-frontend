import { describe, it, expect } from "vitest";
import { unique, chunk, deepClone } from "./index";

describe("collections utilities", () => {
  it("removes duplicates with unique()", () => {
    expect(unique([1, 1, 2, 3])).toEqual([1, 2, 3]);
    expect(unique(["a", "a", "b"])).toEqual(["a", "b"]);
  });

  it("splits array into chunks with chunk()", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(() => chunk([1, 2], 0)).toThrow();
  });

  it("deep clones objects with deepClone()", () => {
    const obj = { a: 1, b: { c: 2 } };
    const clone = deepClone(obj);
    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj); // ensure it's a new reference
  });
});