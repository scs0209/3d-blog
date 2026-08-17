import { Prisma } from '@prisma/client';

const RETRIABLE_PRISMA_CODES = new Set([
  'P1001', // Can't reach database server
  'P1002', // Database server timed out
  'P1008', // Operations timed out
  'P1017', // Server has closed the connection
  'P2024', // Timed out fetching a new connection from the connection pool
]);

const RETRIABLE_MESSAGE = /connection|timeout|econnreset|econnrefused|too many clients/i;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetriableError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return RETRIABLE_PRISMA_CODES.has(error.code);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  if (error instanceof Error) {
    return RETRIABLE_MESSAGE.test(error.message);
  }

  return false;
};

/** Supabase pooler 일시 장애·cold start 시 재시도 */
export const withPrismaRetry = async <T>(operation: () => Promise<T>, maxAttempts = 3): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isRetriableError(error) || attempt === maxAttempts) {
        throw error;
      }
      await sleep(150 * 2 ** (attempt - 1));
    }
  }

  throw lastError;
};
