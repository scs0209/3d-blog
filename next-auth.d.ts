import type NextAuth from 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      accessToken?: string;
      role: string;
      address: string;
      detail_address: string;
      image?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role?: Role | null;
    address?: string;
    detail_address?: string;
  }
}
