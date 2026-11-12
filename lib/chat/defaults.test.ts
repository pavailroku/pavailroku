import { describe, expect, it } from "vitest";
import { fillAsk } from "./defaults";
import { parseChat } from "./parse";

describe("fillAsk", () => {
  it("still produces a runnable UK Senior SWE £90k ask from a vague sentence", () => {
    const filled = fillAsk(parseChat("where should we hire", false));
    expect(filled.role).toBe("Senior Software Engineer");
    expect(filled.countrySet).toBe("UK");
    expect(filled.budget).toBe(90000);
    expect(filled.assumed.length).toBeGreaterThan(0);
  });
});
