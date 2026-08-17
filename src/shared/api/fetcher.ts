/* eslint-disable */
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import qs, { type ParsedUrlQueryInput } from 'querystring';
import type { paths } from './openapi-types';

type Path = keyof paths;
type Method<P extends Path> = keyof paths[P];

type RequestBody<P extends Path, M extends Method<P>> = paths[P][M] extends {
  requestBody: { content: { 'application/json': unknown } };
}
  ? paths[P][M]['requestBody']['content']['application/json']
  : undefined;

type RequestPathParams<P extends Path, M extends Method<P>> = paths[P][M] extends {
  parameters: { path: unknown };
}
  ? paths[P][M]['parameters']['path']
  : undefined;

type RequestQueryParams<P extends Path, M extends Method<P>> = paths[P][M] extends {
  parameters: { query?: unknown };
}
  ? paths[P][M]['parameters']['query']
  : undefined;

type BodyParameter<P extends Path, M extends Method<P>> = RequestBody<P, M> extends undefined
  ? {}
  : { body: RequestBody<P, M> };

type QueryParameters<P extends Path, M extends Method<P>> = RequestQueryParams<P, M> extends undefined
  ? {}
  : { query?: RequestQueryParams<P, M> };
type PathParameters<P extends Path, M extends Method<P>> = RequestPathParams<P, M> extends undefined
  ? {}
  : { path: RequestPathParams<P, M> };

/** path param을 유니코드로 정규화. 인코딩은 fetch/URL이 1회만 수행 */
const toPathSegment = (value: string | number) => {
  let decoded = String(value);
  for (let i = 0; i < 3; i++) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
};

type FetcherParams<P extends Path, M extends Method<P>> = {
  url: P;
  method: M;
  config?: Omit<RequestInit, 'url' | 'method'>;
} & BodyParameter<P, M> &
  QueryParameters<P, M> &
  PathParameters<P, M>;

export const fetcher = async <P extends Path, M extends Method<P>>({
  url,
  method,
  config,
  ...restParams
}: FetcherParams<P, M>) => {
  let finalUrl = `${url}`;

  const body = 'body' in restParams ? JSON.stringify(restParams.body) : undefined;

  if ('query' in restParams) {
    const queryStr = qs.stringify(restParams.query as ParsedUrlQueryInput);
    finalUrl += `?${queryStr}`;
  }

  if ('path' in restParams) {
    const pathObj = restParams.path as Record<string, string | number>;
    const replacedPathUrl = finalUrl.replace(/\{(\w+)\}/g, (match, key) => {
      const value = pathObj[key];
      if (value == null) return match;
      return toPathSegment(value);
    });
    finalUrl = replacedPathUrl;
  }

  // 서버 환경에서 finalUrl이 /로 시작하면 절대경로로 변환 (URL이 path를 1회 인코딩)
  const isServer = typeof window === 'undefined';
  if (isServer && finalUrl.startsWith('/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    finalUrl = new URL(finalUrl, baseUrl).href;
  }

  const res = await fetch(finalUrl, {
    ...config,
    method: method as string,
    body,
    headers: {
      ...config?.headers,
      ...(body ? { 'Content-type': 'application/json' } : {}),
    },
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const errorBody = await res.json();
      if (typeof errorBody?.error === 'string' && errorBody.error.trim() !== '') {
        message = errorBody.error;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      // ignore non-json error bodies
    }
    throw new Error(message);
  }

  return res.json();
};
