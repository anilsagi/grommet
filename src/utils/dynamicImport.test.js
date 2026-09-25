import { describe, expect, it } from "vitest";

describe("dynamic import", () => {
  it("should load a module dynamically", async () => {
    const module = await import("@/utils/lazyMessage");

expect(module.lazyMessage).toBe("Loaded dynamically!");  });
});