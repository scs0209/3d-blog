/** SSR/서버 fetch용 절대 URL. Vercel에서는 VERCEL_URL을 자동 사용 */
export const getBaseUrl = () => {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;

  const vercelHost = process.env.VERCEL_URL?.replace(/\/$/, '');
  if (vercelHost) return `https://${vercelHost}`;

  return 'http://localhost:3000';
};
