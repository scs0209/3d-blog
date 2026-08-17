/* eslint-disable */
import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from './get-database-url';

const prismaClientSingleton = () => {
  const databaseUrl = getDatabaseUrl();
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    ...(databaseUrl
      ? {
          datasources: {
            db: { url: databaseUrl },
          },
        }
      : {}),
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

// Vercel serverless: 인스턴스당 PrismaClient 1개만 유지 (연결 폭주 방지)
globalThis.prisma = prisma;
