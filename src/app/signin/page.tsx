import { SignInPanel } from "@/features/auth/sign-in-panel";
import { isEntraConfigured, isPreAlphaMode } from "@/lib/config";
import { safeRedirect } from "@/lib/safe-redirect";

interface SignInPageProps {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  if (isPreAlphaMode) {
    return (
      <section className="page">
        <h1>Sign in is not open yet</h1>
        <p>
          We&apos;re currently in pre-alpha. Join the alpha list and we&apos;ll
          invite you when account access opens.
        </p>
      </section>
    );
  }

  const resolvedSearchParams = await searchParams;
  const callbackUrl = safeRedirect(resolvedSearchParams?.callbackUrl, "/account");

  return <SignInPanel callbackUrl={callbackUrl} isConfigured={isEntraConfigured} />;
}
