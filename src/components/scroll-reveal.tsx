"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms for items inside a list */
  stagger?: number;
}

/**
 * Wraps children in a container that fades + slides in when it
 * enters the viewport. Uses IntersectionObserver — no deps.
 */
export function ScrollReveal({
  children,
  className = "",
  stagger = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

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
    <div
      className={`scroll-reveal ${className}`}
      ref={ref}
      style={stagger ? ({ "--reveal-delay": `${stagger}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
