import { describe, expect, it } from "vitest";
import { clampPage, formatRating } from "@/lib/utils";

describe("catalog utilities", () => {
  it("formats ratings for Brazilian Portuguese", () => {
    expect(formatRating(8.25)).toBe("8,3");
    expect(formatRating(0)).toBe("—");
  });

  it("clamps page numbers to valid bounds", () => {
    expect(clampPage(0, 10)).toBe(1);
    expect(clampPage(11, 10)).toBe(10);
    expect(clampPage(4, 10)).toBe(4);
  });
});
