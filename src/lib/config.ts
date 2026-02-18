export const websiteBackendBaseUrl =
  process.env.WEBSITE_BACKEND_BASE_URL ?? "http://localhost:8080";

export const defaultDocsUrl =
  process.env.NEXT_PUBLIC_DEFAULT_DOCS_URL ??
  "https://docs.godotengine.org/en/latest/";

export const isEntraConfigured = Boolean(
  process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET &&
    process.env.AZURE_AD_TENANT_ID,
);
