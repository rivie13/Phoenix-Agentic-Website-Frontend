import type { Metadata } from "next";
import { type ReactNode } from "react";

import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Phoenix Agentic Engine",
  description:
    "Public website for Phoenix Agentic Engine: pricing, docs, downloads, account, and donations.",
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
