import { describe, expect, it } from "vitest";
import { connections } from "./connections";

describe("connections", () => {
  it("reports Glean and Confluence as disconnected without env", () => {
    const c = connections();
    expect(c.find((x) => x.id === "glean")?.connected).toBe(false);
    expect(c.find((x) => x.id === "confluence")?.connected).toBe(false);
  });
});
