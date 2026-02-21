# Daily Blog Variables — GitHub UI Setup

This guide is for setting **repository variables manually in GitHub UI**.
No API calls or scripts are required.

## Where to set them

1. Open repository: `rivie13/Phoenix-Agentic-Website-Frontend`
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Open the **Variables** tab
4. Click **New repository variable** for each entry below

## Required variables

| Variable | Recommended value | Notes |
|---|---|---|
| `BLOG_ENABLED` | `true` | Master on/off switch |
| `BLOG_IMAGE_ENABLED` | `true` | Keep true if using Pollinations hero image |
| `BLOG_TEXT_PROVIDER` | `pollinations` | Pollinations-first, GitHub fallback |
| `BLOG_TEXT_MODEL_POLLINATIONS` | `openai` | Primary Pollinations text model |
| `BLOG_TEXT_MODEL_POLLINATIONS_FALLBACK` | `openai-fast` | Fallback Pollinations model |
| `BLOG_TEXT_MODEL_GITHUB` | `openai/gpt-5-chat` | Cross-provider fallback model |
| `BLOG_TEXT_MODEL_GITHUB_FALLBACK` | *(empty)* | Optional second GitHub model |
| `BLOG_MAX_COMMITS` | `30` | Limited payload cap |
| `BLOG_MAX_MERGED_PRS` | `15` | Limited payload cap |
| `BLOG_MAX_OPEN_PRS` | `20` | Limited payload cap |
| `BLOG_MAX_ISSUES` | `15` | Limited payload cap |

## Optional variables

| Variable | Default | Notes |
|---|---|---|
| `BLOG_CROSSPOST_GITHUB_PAGES` | `false` | Cross-post to `rivie13.github.io` |
| `BLOG_SOCIAL_BLUESKY` | `false` | Post after merge |
| `BLOG_SOCIAL_LINKEDIN` | `false` | Post after merge |

## How fallback now works

Text generation uses this sequence:

1. **Primary provider** (`BLOG_TEXT_PROVIDER`, default `pollinations`)
2. Payload tier retries on same provider/model chain:
   - `full` activity payload
   - `limited` activity payload
   - `ultra` activity payload
3. If still no content, switch to **secondary provider** and run the same tier sequence.

If you keep defaults, effective order is:

- Pollinations primary model (`openai`) on full/limited/ultra
- Pollinations fallback model (`openai-fast`) on full/limited/ultra
- GitHub model (`openai/gpt-5-chat`) on full/limited/ultra
- GitHub fallback model (if set) on full/limited/ultra

## Free-tier presets

Pick one preset and set the four `BLOG_MAX_*` variables accordingly.

### 1 pollen/day (safest)

- `BLOG_MAX_COMMITS=12`
- `BLOG_MAX_MERGED_PRS=6`
- `BLOG_MAX_OPEN_PRS=8`
- `BLOG_MAX_ISSUES=6`

### 3 pollen/day (balanced)

- `BLOG_MAX_COMMITS=20`
- `BLOG_MAX_MERGED_PRS=10`
- `BLOG_MAX_OPEN_PRS=14`
- `BLOG_MAX_ISSUES=10`

### 10 pollen/day (richer)

- `BLOG_MAX_COMMITS=30`
- `BLOG_MAX_MERGED_PRS=15`
- `BLOG_MAX_OPEN_PRS=20`
- `BLOG_MAX_ISSUES=15`

## Required secrets (still in GitHub UI)

In **Settings** → **Secrets and variables** → **Actions** → **Secrets**:

- `POLLINATIONS_API_KEY` (required for Pollinations text/image)
- `GH_PAT` (optional, needed for cross-posting and some push scenarios)
- Social secrets only if social toggles are enabled

## Quick test

1. Set/update variables
2. Trigger `.github/workflows/daily-blog.yml` with **Run workflow**
3. Check logs under **Generate blog post** for:
   - provider used
   - model used
   - payload tier used (`full`, `limited`, `ultra`)
