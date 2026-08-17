const appendQueryParam = (url: string, key: string, value: string) => {
  if (new RegExp(`[?&]${key}=`).test(url)) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${key}=${value}`;
};

/** Supabase pooler: 인스턴스당 연결 1개로 제한 */
export const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;

  let next = appendQueryParam(url, 'connection_limit', '1');
  if (next.includes(':6543')) {
    next = appendQueryParam(next, 'pgbouncer', 'true');
  }
  return next;
};
