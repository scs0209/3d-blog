import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { TAG_QUERY_KEY } from './tag';
import { CATEGORY_QUERY_KEY } from './category';

export const queryKeys = mergeQueryKeys(TAG_QUERY_KEY, CATEGORY_QUERY_KEY);
