---
name: github-code-review
description: Fetch and address GitHub pull request code review comments, including Copilot code reviews. Use when user asks to get review feedback, address review comments, fix review issues, request a code review, check PR reviews, or respond to reviewer feedback.
---

# GitHub Code Review — Phoenix Agentic Website Frontend

## Repo Context

- **Owner**: `rivie13`
- **Repo**: `Phoenix-Agentic-Website-Frontend`
- **Type**: Public (Website Frontend)

## Workflow: Fetch & Address Review Comments

### Step 1: Identify the PR

If the user doesn't specify a PR number, list open PRs:

```
mcp_github_github_list_pull_requests(owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", state="open")
```

### Step 2: Get review comments

```
mcp_github_github_pull_request_read(method="get_review_comments", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", pullNumber=<PR_NUMBER>)
```

Get review status:

```
mcp_github_github_pull_request_read(method="get_reviews", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", pullNumber=<PR_NUMBER>)
```

### Step 3: Get changed files for context

```
mcp_github_github_pull_request_read(method="get_files", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", pullNumber=<PR_NUMBER>)
```

### Step 4: Address each unresolved comment

For each unresolved review thread:
1. Read the file and surrounding context using `read_file`
2. Understand the reviewer's concern
3. Make the fix using file edit tools
4. Run local validation (`npm run lint; npm run typecheck; npm run test; npm run build`)
5. Push the fix batch
6. Report what was changed and why

### Step 4b: Check status checks/workflows after fixes (required)

After each push for review feedback:

1. Check PR status checks and workflow runs.
2. If any workflow/check fails, use `github-actions-debug` workflow.
3. Apply fixes, re-run local validation, and push again.
4. Repeat until required checks are green.

### Step 5: Request a new review (optional)

Only request a new Copilot review if either:
- no prior Copilot review exists on the PR, or
- new commits were pushed after the latest Copilot review.

```
mcp_github_github_request_copilot_review(owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", pullNumber=<PR_NUMBER>)
```

## Review priorities for this repo

- No API keys, secrets, or tokens in client-side code
- Security boundary rules from `docs/SECURITY_BOUNDARY.md` respected
- Accessibility standards maintained
- SSR compatibility for all components
- Validate full check passes after fixes
