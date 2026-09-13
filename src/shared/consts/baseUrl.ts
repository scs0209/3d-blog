import { getBaseUrl } from '@/shared/lib/get-base-url';

export const baseUrl = getBaseUrl();

export const toAbsoluteUrl = (path: string) => {
  if (!path) return baseUrl;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export const getPostPath = (categorySlug: string | null | undefined, postSlug: string) =>
  `/blog/category/${categorySlug || 'uncategorized'}/post/${encodeURIComponent(postSlug)}`;

export const getPostUrl = (categorySlug: string | null | undefined, postSlug: string) =>
  toAbsoluteUrl(getPostPath(categorySlug, postSlug));

export const extractDescription = (content: string, maxLength = 160) => {
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.substring(0, maxLength).replace(/\s+\S*$/, '')}...`;
};

/** HTML 본문을 길이 제한 없이 평문으로 추출 (JSON-LD articleBody 등) */
export const extractPlainText = (content: string) =>
  content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

