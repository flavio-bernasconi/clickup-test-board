import NextAuth from "next-auth";
import ClickUp from "@auth/core/providers/click-up";

export const authOptions = {
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account["access_token"];
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    ClickUp({
      clientId: process.env.CLINT_ID,
      clientSecret: process.env.SECRET_CLINT_ID,
    }),
  ],
};

export default NextAuth(authOptions);
