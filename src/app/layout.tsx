import type { Metadata } from "next";
import { type ReactNode } from "react";

import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { SiteShell } from "@/components/site-shell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phoenix-agentic.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Phoenix — AI-Native Game Development",
    template: "%s | Phoenix",
  },
  description:
    "Phoenix is an AI-native Godot fork with a built-in assistant that helps you build games faster. Ask questions, plan changes, and let the agent execute — all inside the editor.",
  icons: {
    icon: [
      { url: "/images/phoenix-icon.png", type: "image/png" },
    ],
    apple: "/images/phoenix-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Phoenix Agentic Engine",
    title: "Phoenix — AI-Native Game Development",
    description:
      "An AI-native Godot fork with a built-in assistant. Ask questions, plan changes, and let the agent execute — all inside the editor.",
    url: siteUrl,
    images: [
      {
        url: "/images/phoenix-icon.png",
        width: 512,
        height: 512,
        alt: "Phoenix Agentic Engine logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Phoenix — AI-Native Game Development",
    description:
      "An AI-native Godot fork with a built-in assistant. Ask questions, plan changes, and let the agent execute — all inside the editor.",
    images: ["/images/phoenix-icon.png"],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}
