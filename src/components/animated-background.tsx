"use client";

/**
 * Animated background with floating gradient orbs and a subtle dot grid.
 * Pure CSS — no external deps.
 */
export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="animated-bg">
      <div className="animated-bg-orb animated-bg-orb-1" />
      <div className="animated-bg-orb animated-bg-orb-2" />
      <div className="animated-bg-orb animated-bg-orb-3" />
      <div className="animated-bg-grid" />
    </div>
  );
}
