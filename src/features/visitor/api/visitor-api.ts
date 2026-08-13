import { fetcher } from '@/shared/api';

export const getVisitor = () => fetcher({ url: '/api/visitor', method: 'get' });

/** path는 하위 호환용 — 서버는 더 이상 저장하지 않음 */
export const plusVisitor = (path = '/') =>
  fetcher({
    url: '/api/visitor',
    method: 'post',
    body: { path },
  });
