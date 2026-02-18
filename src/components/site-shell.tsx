import Link from "next/link";
import { type ReactNode } from "react";

import { AuthControls } from "@/components/auth-controls";

interface SiteShellProps {
  children: ReactNode;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demos", label: "Demos" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/docs", label: "Docs" },
  { href: "/download", label: "Download" },
  { href: "/donate", label: "Donate" },
];

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
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
            Phoenix Agentic Engine public site. Godot is a registered trademark of
            the Godot Foundation.
          </small>
        </div>
      </footer>
    </div>
  );
}
