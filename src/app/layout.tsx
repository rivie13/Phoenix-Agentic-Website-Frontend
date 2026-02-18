import type { Metadata } from "next";
import { type ReactNode } from "react";

import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Phoenix — AI-Native Game Development",
  description:
    "Phoenix is an AI-native Godot fork with a built-in assistant that helps you build games faster. Ask questions, plan changes, and let the agent execute — all inside the editor.",
  icons: {
    icon: "/images/phoenix-icon.png",
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
