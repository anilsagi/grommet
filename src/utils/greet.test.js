import { describe, expect, it } from "vitest";
import { greet } from "@/utils/greet";

describe("greet", () => {
  it("should return a greeting", () => {
    expect(greet("Anil")).toBe("Hello, Anil!");
  });
});