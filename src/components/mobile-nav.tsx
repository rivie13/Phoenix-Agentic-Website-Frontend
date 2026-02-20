"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  navLinks: NavLink[];
  showAuth?: boolean;
}

export function MobileNav({ navLinks, showAuth }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Escape key closes drawer
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        toggleBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Trap focus inside drawer when open
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length) focusable[0].focus();
  }, [isOpen]);

  return (
    <>
      {/* Hamburger toggle button — hidden on desktop via CSS */}
      <button
        ref={toggleBtnRef}
        aria-controls="mobile-nav-drawer"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="hamburger-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <span aria-hidden="true" className={`hamburger-bar${isOpen ? " open" : ""}`} />
        <span aria-hidden="true" className={`hamburger-bar${isOpen ? " open" : ""}`} />
        <span aria-hidden="true" className={`hamburger-bar${isOpen ? " open" : ""}`} />
      </button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="mobile-nav-overlay"
          onClick={close}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        aria-hidden={!isOpen}
        className={`mobile-nav-drawer${isOpen ? " is-open" : ""}`}
        id="mobile-nav-drawer"
      >
        <nav aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              className="mobile-nav-link"
              href={link.href}
              key={link.href}
              tabIndex={isOpen ? 0 : -1}
            >
              {link.label}
            </Link>
          ))}
          {showAuth && (
            <hr className="mobile-nav-divider" />
          )}
        </nav>
      </div>
    </>
  );
}
