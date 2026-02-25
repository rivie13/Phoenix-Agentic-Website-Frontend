# Azure App Service Deployment — Setup Guide

This document lists every manual step required to wire up the automated deployment
workflow (`.github/workflows/deploy.yml`) that was added in PR #34.

---

## 1. Provision Azure App Service

1. Log in to the [Azure Portal](https://portal.azure.com).
2. Create a new **App Service** (or use the existing one if already provisioned):
   - **Runtime stack**: Node 20 LTS
   - **OS**: Linux
   - **Region**: your preferred region
   - **Plan**: B1 (Basic) or higher for production
3. Note the **App Service name** — you will need it for the `AZURE_WEBAPP_NAME`
   GitHub variable below.

---

## 2. Configure the App Service for Node/Next.js

1. In the App Service → **Configuration → General settings**, set:
   - **Startup Command**: `node node_modules/.bin/next start`
2. In the App Service → **Configuration → Application settings**, add the
   runtime environment variables that Next.js needs at startup (these are in
   addition to the build-time env vars already injected by the workflow):

   | Name | Example value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `NEXTAUTH_URL` | `https://your-app.azurewebsites.net` |
   | `NEXTAUTH_SECRET` | *(generate with `openssl rand -base64 32`)* |
   | `AZURE_AD_CLIENT_ID` | *(from your Entra app registration)* |
   | `AZURE_AD_CLIENT_SECRET` | *(from your Entra app registration)* |
   | `AZURE_AD_TENANT_ID` | *(from your Entra tenant)* |
   | `NEXT_PUBLIC_API_BASE_URL` | `https://api.phoenix-agentic.com` |

---

## 3. Download the Publish Profile

1. In the Azure Portal, go to your App Service.
2. Click **Get publish profile** (top action bar) — this downloads an XML file.
3. Keep this file safe; you will paste its contents into a GitHub secret next.

---

## 4. Configure GitHub Secrets and Variables

Navigate to your repository → **Settings → Secrets and variables → Actions**.

### Secrets (encrypted, never logged)

| Secret name | Value |
|---|---|
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Full XML contents of the publish profile downloaded above |
| `NEXTAUTH_SECRET` | Random 32-byte base64 string (run `openssl rand -base64 32`) |
| `AZURE_AD_CLIENT_ID` | Client (application) ID of your Entra app registration |
| `AZURE_AD_CLIENT_SECRET` | Client secret value from your Entra app registration |
| `AZURE_AD_TENANT_ID` | Directory (tenant) ID from your Entra tenant |

### Variables (plain-text, visible in logs)

| Variable name | Value |
|---|---|
| `AZURE_WEBAPP_NAME` | Name of your Azure App Service (e.g. `phoenix-frontend`) |
| `NEXTAUTH_URL` | Canonical production URL (e.g. `https://phoenix-frontend.azurewebsites.net`) |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL (e.g. `https://api.phoenix-agentic.com`) |

---

## 5. Create the GitHub Environment (production)

The workflow references an environment named `production`. Set it up so you can
add protection rules and deployment history:

1. Go to **Settings → Environments → New environment**.
2. Name it exactly **`production`**.
3. (Optional) Add **required reviewers** or a **wait timer** for manual approval
   before each deployment.
4. You can also restrict which branches can deploy to this environment (set to
   `main`).

---

## 6. Verify the Entra App Registration

The following redirect URIs must be registered in your Microsoft Entra
(Azure AD) app registration:

- `https://<your-domain>/api/auth/callback/azure-ad`
- `https://<your-domain>/api/auth/callback/azure-ad` (replace with custom
  domain once configured)

---

## 7. First Deployment

Once all secrets and variables are configured:

1. Merge a commit into `main` (or push directly).
2. The **CI** workflow runs first (`ci.yml`).
3. Once CI passes, the **Deploy to Azure** workflow (`deploy.yml`) triggers
   automatically.
4. Check the **Actions** tab → **Deploy to Azure** run for status.
5. Verify the deployed app at the URL shown in the workflow output
   (`webapp-url` step output).

---

## 8. Rollback

To roll back to a previous deployment:

1. In the **Actions** tab, find the **Deploy to Azure** run for the commit you
   want to redeploy.
2. Click **Re-run all jobs** on that run.
3. This deploys exactly the build artifacts from that commit.

Alternatively, revert the offending commit in `main` to trigger a fresh build
and deploy of the reverted state.

---

## 9. Custom Domain (future step)

Once the app is live on `azurewebsites.net`, follow the Azure App Service
custom domain guide to:

1. Purchase `phoenix-agentic.com` (or your chosen domain) via Azure DNS or
   another registrar.
2. Add a CNAME/A record pointing to the App Service.
3. Add the custom domain in **App Service → Custom domains**.
4. Provision a free **App Service Managed Certificate** for HTTPS.
5. Update `NEXTAUTH_URL` (GitHub variable) and the Entra redirect URIs to the
   new custom domain.
