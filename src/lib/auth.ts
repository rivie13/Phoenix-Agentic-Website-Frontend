import { type NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

const hasEntraConfig = Boolean(
  process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET &&
    process.env.AZURE_AD_TENANT_ID,
);

const providers = hasEntraConfig
  ? [
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID as string,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
        tenantId: process.env.AZURE_AD_TENANT_ID as string,
      }),
    ]
  : [];

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
};
