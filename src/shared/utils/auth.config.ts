import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/',
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // OAuth 로그인 시 로직
        return {
          ...token,
          id: account?.id ? account.id : user.id,
          accessToken: account?.access_token,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          accessToken: token.accessToken ? token.accessToken : null,
          role: token.role,
        },
      };
    },
  },
  providers: [],
} satisfies NextAuthConfig;
