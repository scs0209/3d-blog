import { createQueryKeys } from '@lukemorales/query-key-factory';

export const VISITOR_QUERY_KEY = createQueryKeys('visitor', {
  today: null,
  total: null,
});
