import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

import { AuthControls } from "@/components/auth-controls";

interface SiteShellProps {
  children: ReactNode;
}

const navLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/demos", label: "Demos" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
  { href: "/donate", label: "Donate" },
  { href: "/download", label: "Download" },
];

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-brand" href="/">
            <Image
              alt="Phoenix"
              height={32}
              priority
              src="/images/phoenix-icon.png"
              width={32}
            />
            Phoenix
          </Link>
          <nav aria-label="Main navigation" className="site-nav">
            {navLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <AuthControls />
        </div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <small>
            &copy; {new Date().getFullYear()} Phoenix Agentic Engine. Built on{" "}
            <a
              className="inline-link"
              href="https://godotengine.org"
              rel="noopener noreferrer"
              target="_blank"
            >
              Godot Engine
            </a>
            . Godot is a trademark of the Godot Foundation.
          </small>
          <div className="footer-links">
            <Link href="/docs">Docs</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/donate">Donate</Link>
            <a
              href="https://github.com/godotengine/godot"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
