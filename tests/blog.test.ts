import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_CWD = process.cwd();
let tmpDir = "";

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "phoenix-blog-test-"));
  process.chdir(tmpDir);
  vi.resetModules();
});

afterEach(() => {
  process.chdir(ORIGINAL_CWD);
  if (tmpDir) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
  vi.resetModules();
});

function writePost(fileName: string, frontMatter: string, body = "Post body") {
  const blogDir = path.join(process.cwd(), "content", "blog");
  fs.mkdirSync(blogDir, { recursive: true });
  fs.writeFileSync(
    path.join(blogDir, fileName),
    `---\n${frontMatter}\n---\n\n${body}\n`,
    "utf-8",
  );
}

describe("blog library", () => {
  it("applies front matter defaults and tag normalization", async () => {
    writePost(
      "defaults.md",
      [
        'title: "Defaults Post"',
        'tags: [engine, 123]',
      ].join("\n"),
    );

    const { getAllPosts } = await import("@/lib/blog");
    const [post] = getAllPosts();

    expect(post).toBeDefined();
    expect(post.slug).toBe("defaults");
    expect(post.title).toBe("Defaults Post");
    expect(post.date).toBe("");
    expect(post.author).toBe("Unknown");
    expect(post.aiGenerated).toBe(false);
    expect(post.tags).toEqual(["engine", "123"]);
    expect(post.heroImage).toBe("/images/phoenix-icon.png");
    expect(post.summary).toBe("");
  });

  it("sorts by date descending and keeps deterministic order for ties", async () => {
    writePost("b-post.md", 'date: "2026-02-20"\ntitle: "B"');
    writePost("a-post.md", 'date: "2026-02-20"\ntitle: "A"');
    writePost("older.md", 'date: "2026-02-19"\ntitle: "Older"');
    writePost("undated.md", 'title: "Undated"');

    const { getAllPosts } = await import("@/lib/blog");
    const posts = getAllPosts();

    expect(posts.map((post) => post.slug)).toEqual([
      "a-post",
      "b-post",
      "older",
      "undated",
    ]);
  });

  it("renders markdown HTML content for slug lookups", async () => {
    writePost(
      "render-test.md",
      [
        'title: "Render Test"',
        'date: "2026-02-20"',
      ].join("\n"),
      "## Heading\n\nParagraph with **bold** text.",
    );

    const { getPostBySlug } = await import("@/lib/blog");
    const post = await getPostBySlug("render-test");

    expect(post).not.toBeNull();
    expect(post?.contentHtml).toContain("<h2>Heading</h2>");
    expect(post?.contentHtml).toContain("<strong>bold</strong>");
  });
});
