import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

import { AnimatedBackground } from "@/components/animated-background";
import { AuthControls } from "@/components/auth-controls";
import { isPreAlphaMode } from "@/lib/config";

interface SiteShellProps {
  children: ReactNode;
}

const fullNavLinks = [
  { href: "/alpha", label: "Alpha" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demos", label: "Demos" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
  { href: "/privacy", label: "Privacy" },
  { href: "/donate", label: "Donate" },
  { href: "/download", label: "Download" },
];

const preAlphaNavLinks = [
  { href: "/alpha", label: "Alpha" },
  { href: "/blog", label: "Blog" },
  { href: "/privacy", label: "Privacy" },
];

const fullFooterLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/alpha", label: "Alpha" },
  { href: "/donate", label: "Donate" },
];

const preAlphaFooterLinks = [
  { href: "/alpha", label: "Alpha" },
  { href: "/blog", label: "Blog" },
];

export function SiteShell({ children }: SiteShellProps) {
  const navLinks = isPreAlphaMode ? preAlphaNavLinks : fullNavLinks;
  const footerLinks = isPreAlphaMode ? preAlphaFooterLinks : fullFooterLinks;

  return (
    <div className="site-shell">
      <AnimatedBackground />
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
          {!isPreAlphaMode ? <AuthControls /> : null}
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
            {footerLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/privacy">Privacy</Link>
            <a
              href="https://github.com/rivie13/Phoenix-Agentic-Engine"
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
