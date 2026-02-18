import { describe, expect, it, vi } from "vitest";

import { WebsiteBackendClient, WebsiteBackendError } from "@/lib/api-client";

describe("WebsiteBackendClient", () => {
  it("calls authenticated me endpoint", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ displayName: "Rivie" }), { status: 200 }),
    );

    const client = new WebsiteBackendClient("https://backend.example", "token-value");

    const me = await client.getMe();

    expect(me?.displayName).toBe("Rivie");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    const headers = init?.headers;
    const authorization = headers instanceof Headers ? headers.get("Authorization") : null;

    expect(url).toBe("https://backend.example/api/public/v1/me");
    expect(authorization).toBe("Bearer token-value");
  });

  it("throws safe backend error on failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 500 }));

    const client = new WebsiteBackendClient("https://backend.example", "token-value");

    await expect(client.getAccount()).rejects.toBeInstanceOf(WebsiteBackendError);
  });

  it("parses docs target payload from url field", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ url: "https://docs.godotengine.org/en/latest/" }), {
        status: 200,
      }),
    );

    const client = new WebsiteBackendClient("https://backend.example");
    const target = await client.getDocsTarget();

    expect(target?.url).toBe("https://docs.godotengine.org/en/latest/");
  });
});
