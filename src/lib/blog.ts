import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import type { Post, PostMeta } from "@/types/blog";

/* ── Constants ── */

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

/* ── Helpers ── */

function fileNameToSlug(fileName: string): string {
  return fileName.replace(/\.md$/, "");
}

function parseFrontMatter(
  slug: string,
  raw: matter.GrayMatterFile<string>,
): PostMeta {
  const d = raw.data as Record<string, unknown>;
  return {
    slug,
    title: String(d["title"] ?? slug),
    date: String(d["date"] ?? ""),
    author: String(d["author"] ?? "Unknown"),
    aiGenerated: d["aiGenerated"] === true,
    tags: Array.isArray(d["tags"])
      ? (d["tags"] as string[]).map(String)
      : [],
    heroImage: String(d["heroImage"] ?? "/images/phoenix-icon.png"),
    summary: String(d["summary"] ?? ""),
  };
}

/* ── Public API ── */

/** Return metadata for every blog post, sorted newest-first. */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const raw = matter(
      fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8"),
    );
    return parseFrontMatter(fileNameToSlug(file), raw);
  });

  return posts.sort((a, b) => {
    const aHasDate = a.date.length > 0;
    const bHasDate = b.date.length > 0;

    if (aHasDate && bHasDate) {
      if (a.date > b.date) {
        return -1;
      }

      if (a.date < b.date) {
        return 1;
      }

      return a.slug.localeCompare(b.slug);
    }

    if (aHasDate) {
      return -1;
    }

    if (bHasDate) {
      return 1;
    }

    return a.slug.localeCompare(b.slug);
  });
}

/** Return every known slug (for static-param generation). */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(fileNameToSlug);
}

/** Return a single post by slug, with its body rendered to HTML. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = matter(fs.readFileSync(filePath, "utf-8"));
  const meta = parseFrontMatter(slug, raw);

  // remark & remark-html are ESM-only — dynamic import
  const { remark } = await import("remark");
  const remarkHtml = (await import("remark-html")).default;

  const processed = await remark().use(remarkHtml).process(raw.content);
  const contentHtml = processed.toString();

  return { ...meta, contentHtml };
}
