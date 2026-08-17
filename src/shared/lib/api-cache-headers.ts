/** Vercel CDN 캐시: DB hit 줄이고 cold start burst 완화 */
export const READ_API_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
} as const;
