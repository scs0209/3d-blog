import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './src/shared/utils/auth.config';
// import { auth } from '@/shared/utils/auth';

const protectedRoutes = ['/admin'];

const { auth } = NextAuth(authConfig);
export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session?.user.role !== 'ADMIN' && isProtected) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = { matcher: ['/', '/admin'] };
