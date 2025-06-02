import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { TAG_QUERY_KEY } from './tag';
import { CATEGORY_QUERY_KEY } from './category';
import { VISITOR_QUERY_KEY } from './visitor';

export const queryKeys = mergeQueryKeys(TAG_QUERY_KEY, CATEGORY_QUERY_KEY, VISITOR_QUERY_KEY);
