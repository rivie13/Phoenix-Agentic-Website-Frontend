import { afterEach, describe, expect, it, vi } from "vitest";

type OrchestrationModule = typeof import("@/lib/phoenix-orchestration");

const ORIGINAL_ENV = { ...process.env };

async function loadModuleWithEnv(env: Record<string, string | undefined>): Promise<OrchestrationModule> {
  vi.resetModules();

  process.env = {
    ...ORIGINAL_ENV,
    ...env,
  };

  return import("@/lib/phoenix-orchestration");
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.resetModules();
});

describe("phoenix orchestration auth", () => {
  it("prefers session access token over static fallback token", async () => {
    const mod = await loadModuleWithEnv({
      PHOENIX_GATEWAY_CLIENT_TOKEN: "static-token-fallback",
    });

    const headers = mod.buildGatewayHeaders({
      accessToken: "session-entra-token",
      user: { email: "user@example.com" },
      expires: "2099-01-01T00:00:00.000Z",
    });

    expect(headers.get("Authorization")).toBe("Bearer session-entra-token");
  });

  it("uses static fallback token when session token is unavailable", async () => {
    const mod = await loadModuleWithEnv({
      PHOENIX_GATEWAY_CLIENT_TOKEN: "static-token-fallback",
    });

    const headers = mod.buildGatewayHeaders({
      user: { email: "user@example.com" },
      expires: "2099-01-01T00:00:00.000Z",
    });

    expect(headers.get("Authorization")).toBe("Bearer static-token-fallback");
  });

  it("throws when neither session nor fallback token is available", async () => {
    const mod = await loadModuleWithEnv({
      PHOENIX_GATEWAY_CLIENT_TOKEN: "",
    });

    expect(() =>
      mod.buildGatewayHeaders({
        user: { email: "user@example.com" },
        expires: "2099-01-01T00:00:00.000Z",
      }),
    ).toThrow(/token is missing/i);
  });
});

describe("phoenix orchestration path allowlist", () => {
  it("allows expected orchestration endpoints", async () => {
    const mod = await loadModuleWithEnv({});

    expect(mod.isAllowedOrchestrationPath("POST", ["session", "start"]))
      .toBe(true);
    expect(mod.isAllowedOrchestrationPath("POST", ["task", "request"]))
      .toBe(true);
    expect(mod.isAllowedOrchestrationPath("GET", ["task", "plan-001"]))
      .toBe(true);
    expect(mod.isAllowedOrchestrationPath("POST", ["task", "plan-001", "approval"]))
      .toBe(true);
  });

  it("blocks non-allowlisted orchestration endpoints", async () => {
    const mod = await loadModuleWithEnv({});

    expect(mod.isAllowedOrchestrationPath("DELETE", ["task", "plan-001"]))
      .toBe(false);
    expect(mod.isAllowedOrchestrationPath("POST", ["auth", "refresh"]))
      .toBe(false);
    expect(mod.isAllowedOrchestrationPath("GET", ["tools"]))
      .toBe(false);
  });
});
