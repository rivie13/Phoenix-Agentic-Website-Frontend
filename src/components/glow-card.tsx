"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface GlowCardProps {
  icon: string;
  title: string;
  children: ReactNode;
  /** Optional accent colour override (CSS colour value) */
  accent?: string;
  /** Stagger index for entrance animation */
  index?: number;
}

/**
 * A card with an animated glow border on hover,
 * gradient icon background, and staggered entrance.
 */
export function GlowCard({ icon, title, children, accent, index = 0 }: GlowCardProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      className="glow-card scroll-reveal"
      ref={ref}
      style={
        {
          "--card-accent": accent ?? "var(--accent)",
          "--reveal-delay": `${index * 80}ms`,
        } as React.CSSProperties
      }
    >
      <div className="glow-card-border" />
      <div className="glow-card-content">
        <div className="glow-card-icon">{icon}</div>
        <h3 className="glow-card-title">{title}</h3>
        <p className="glow-card-text">{children}</p>
      </div>
    </article>
  );
}
