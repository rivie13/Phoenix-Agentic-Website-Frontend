import { type ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

interface AccountLayoutProps {
  children: ReactNode;
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/account");
  }

  return <>{children}</>;
}
