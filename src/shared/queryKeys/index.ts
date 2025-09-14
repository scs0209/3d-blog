import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { TAG_QUERY_KEY } from './tag';
import { CATEGORY_QUERY_KEY } from './category';
import { VISITOR_QUERY_KEY } from './visitor';
import { POST_QUERY_KEY } from './post';
import { COMMENT_QUERY_KEY } from './comment';
import { LIKE_QUERY_KEY } from './like';
import { USER_QUERY_KEY } from './user';

export const queryKeys = mergeQueryKeys(
  TAG_QUERY_KEY,
  CATEGORY_QUERY_KEY,
  VISITOR_QUERY_KEY,
  POST_QUERY_KEY,
  COMMENT_QUERY_KEY,
  LIKE_QUERY_KEY,
  USER_QUERY_KEY,
);
