import { createQueryKeys } from '@lukemorales/query-key-factory';

export const COMMENT_QUERY_KEY = createQueryKeys('comment', {
  all: null,
  detail: (id: string) => [id],
});
