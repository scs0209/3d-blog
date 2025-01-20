import NextAuth from 'next-auth';
import { authOptions } from '@/shared/utils/authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
