import type { NextAuthConfig } from 'next-auth';
import type { Session, User } from 'next-auth';

interface CustomUser extends User {
  id: string;
  role: string;
  accessToken: string | null;
}

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
    async session({ session, token }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          name: token.name,
          email: session.user.email,
          image: session.user.image,
          accessToken: token.accessToken as string | null,
          role: token.role as string,
        } as CustomUser,
      };
    },
  },
  providers: [],
} satisfies NextAuthConfig;
