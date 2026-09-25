import { describe, expect, it } from "vitest";

describe("Code splitting", () => {
  it("loads a module dynamically", async () => {
    const module = await import("./lazyMessage.js");

   expect(module.lazyMessage).toBe("Loaded dynamically!");
  });
});