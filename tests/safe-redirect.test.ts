import { describe, expect, it } from "vitest";

import { safeRedirect } from "@/lib/safe-redirect";

describe("safeRedirect", () => {
  it("returns fallback for empty input", () => {
    expect(safeRedirect(undefined, "/account")).toBe("/account");
  });

  it("returns fallback for external url", () => {
    expect(safeRedirect("https://example.com", "/account")).toBe("/account");
  });

  it("returns fallback for protocol-relative path", () => {
    expect(safeRedirect("//evil", "/account")).toBe("/account");
  });

  it("returns local path", () => {
    expect(safeRedirect("/account/billing", "/account")).toBe("/account/billing");
  });
});
