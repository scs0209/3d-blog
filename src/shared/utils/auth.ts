import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcrypt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import prisma from '../lib/db';
import { Session } from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      /* @ts-ignore */
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Please enter an email and password');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          throw new Error('No user found');
        }

        const isValid = await compare(credentials.password as string, user.password as string);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        if (user) {
          return user;
        }
        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    authorized: ({ auth }) => !!auth,
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
          id: token.id as string,
          name: token.name,
          accessToken: token.accessToken,
          role: token.role,
        },
      } as Session;
    },
  },
  pages: {
    signIn: 'login',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV !== 'production',
});
