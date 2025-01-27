import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './src/shared/utils/auth.config';
// import { auth } from '@/shared/utils/auth';

const protectedRoutes = ['/'];

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
}

export const config = { matcher: ['/'] };

// /**
//  * Middleware for authentication
//  * @returns NextResponse or null if not authenticated
//  */
// export default async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   console.log(request.cookies);

//   const isProtected = protectedRoutes.some((route) =>
//     pathname.startsWith(route),
//   );

//   if (!isProtected) {
//     // return (await auth()) // 세션 정보 확인
//     // ? NextResponse.next()
//     NextResponse.redirect(new URL('/login', request.url));
//   }
// }
