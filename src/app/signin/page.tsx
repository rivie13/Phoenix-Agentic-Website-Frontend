import { SignInPanel } from "@/features/auth/sign-in-panel";
import { isEntraConfigured } from "@/lib/config";
import { safeRedirect } from "@/lib/safe-redirect";

interface SignInPageProps {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = await searchParams;
  const callbackUrl = safeRedirect(resolvedSearchParams?.callbackUrl, "/account");

  return <SignInPanel callbackUrl={callbackUrl} isConfigured={isEntraConfigured} />;
}
