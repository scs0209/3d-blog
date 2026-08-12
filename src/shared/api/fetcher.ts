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
    const replacedPathUrl = finalUrl.replace(/\{(\w+)\}/g, (match, key) => String(pathObj[key] || match));
    finalUrl = replacedPathUrl;
  }

  // 서버 환경에서 finalUrl이 /로 시작하면 절대경로로 변환
  const isServer = typeof window === 'undefined';
  if (isServer && finalUrl.startsWith('/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    finalUrl = baseUrl + finalUrl;
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
      if (typeof errorBody?.error === 'string') {
        message = errorBody.error;
      }
    } catch {
      // ignore non-json error bodies
    }
    throw new Error(message);
  }

  return res.json();
};
