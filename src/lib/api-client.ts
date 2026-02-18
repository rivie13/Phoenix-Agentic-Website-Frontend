export interface AccountSummary {
  id?: string;
  plan?: string;
  status?: string;
}

export interface EntitlementSummary {
  code: string;
  active: boolean;
}

export interface DownloadItem {
  id: string;
  title: string;
  url?: string;
}

export interface DocsTarget {
  url: string;
}

export interface UserSummary {
  id?: string;
  email?: string;
  displayName?: string;
}

export class WebsiteBackendError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "WebsiteBackendError";
  }
}

export class WebsiteBackendClient {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken?: string,
  ) {}

  async getMe(): Promise<UserSummary | null> {
    return this.request<UserSummary | null>("/api/public/v1/me");
  }

  async getAccount(): Promise<AccountSummary | null> {
    return this.request<AccountSummary | null>("/api/public/v1/account");
  }

  async getEntitlements(): Promise<EntitlementSummary[]> {
    return this.request<EntitlementSummary[]>("/api/public/v1/entitlements");
  }

  async getDownloads(): Promise<DownloadItem[]> {
    return this.request<DownloadItem[]>("/api/public/v1/downloads");
  }

  async startCheckout(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>("/api/public/v1/billing/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async startBillingPortal(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>("/api/public/v1/billing/portal", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getDocsTarget(): Promise<DocsTarget | null> {
    const payload = await this.request<Record<string, unknown>>(
      "/api/public/v1/docs-target",
      {},
      false,
    );

    if (!payload) {
      return null;
    }

    const value =
      typeof payload.url === "string"
        ? payload.url
        : typeof payload.target === "string"
          ? payload.target
          : null;

    return value ? { url: value } : null;
  }

  private async request<T>(
    path: string,
    init?: RequestInit,
    useAuth = true,
  ): Promise<T> {
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");

    if (init?.body) {
      headers.set("Content-Type", "application/json");
    }

    if (useAuth && this.accessToken) {
      headers.set("Authorization", `Bearer ${this.accessToken}`);
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new WebsiteBackendError(
        "Unable to complete this request right now.",
        response.status,
      );
    }

    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  }
}
