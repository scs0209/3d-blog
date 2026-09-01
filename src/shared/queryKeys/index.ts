import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { CATEGORY_QUERY_KEY } from './category';
import { COMMENT_QUERY_KEY } from './comment';
import { LIKE_QUERY_KEY } from './like';
import { POST_QUERY_KEY } from './post';
import { TAG_QUERY_KEY } from './tag';
import { USER_QUERY_KEY } from './user';
import { VISITOR_QUERY_KEY } from './visitor';

export { SIDEBAR_QUERY_KEY } from './sidebar';

export const queryKeys = mergeQueryKeys(
  TAG_QUERY_KEY,
  CATEGORY_QUERY_KEY,
  VISITOR_QUERY_KEY,
  POST_QUERY_KEY,
  COMMENT_QUERY_KEY,
  LIKE_QUERY_KEY,
  USER_QUERY_KEY,
);
