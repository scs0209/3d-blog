import { fetcher } from '@/shared/api';

export const getVisitor = () => fetcher({ url: '/api/visitor', method: 'get' });

type PlusVisitorParams = {
  visitorId: string;
  /** 하위 호환용 — 서버는 저장하지 않음 */
  path?: string;
};

export const plusVisitor = ({ visitorId, path = '/' }: PlusVisitorParams) =>
  fetcher({
    url: '/api/visitor',
    method: 'post',
    body: { path, visitorId },
  });
