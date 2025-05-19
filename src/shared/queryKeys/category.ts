import { createQueryKeys } from '@lukemorales/query-key-factory';

export const CATEGORY_QUERY_KEY = createQueryKeys('category', {
  all: null,
  posts: (slug: string, page: number, limit: number) => [slug, page, limit],
});
