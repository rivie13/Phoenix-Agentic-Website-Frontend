export const websiteBackendBaseUrl =
  process.env.WEBSITE_BACKEND_BASE_URL ?? "http://localhost:8080";

export const phoenixGatewayBaseUrl =
  process.env.PHOENIX_GATEWAY_BASE_URL ?? "http://localhost:5244";

export const phoenixGatewayClientToken =
  process.env.PHOENIX_GATEWAY_CLIENT_TOKEN;

export const phoenixGatewayServiceMode =
  process.env.PHOENIX_GATEWAY_SERVICE_MODE ?? "managed";

export const phoenixGatewayDefaultTier =
  process.env.PHOENIX_GATEWAY_DEFAULT_TIER ?? "free";

export const defaultDocsUrl =
  process.env.NEXT_PUBLIC_DEFAULT_DOCS_URL ??
  "https://docs.godotengine.org/en/latest/";

export const isEntraConfigured = Boolean(
  process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET &&
    process.env.AZURE_AD_TENANT_ID,
);
