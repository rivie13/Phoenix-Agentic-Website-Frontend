import { withAuth } from "next-auth/middleware";
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";

const isPreAlphaMode = process.env.NEXT_PUBLIC_PRE_ALPHA_MODE !== "false";

const preAlphaBlockedPrefixes = [
  "/account",
  "/signin",
  "/pricing",
  "/demos",
  "/reviews",
  "/docs",
  "/donate",
  "/download",
] as const;

const accountMiddleware = withAuth({
  pages: {
    signIn: "/signin",
  },
});

function isBlockedPath(pathname: string): boolean {
  return preAlphaBlockedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  if (isPreAlphaMode && isBlockedPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/alpha";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === "/account" || pathname.startsWith("/account/")) {
    return accountMiddleware(
      request as Parameters<typeof accountMiddleware>[0],
      event,
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/signin",
    "/pricing",
    "/demos/:path*",
    "/reviews",
    "/docs/:path*",
    "/donate",
    "/download",
  ],
};
