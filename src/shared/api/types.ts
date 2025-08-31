import type { paths } from './openapi-types';

type Path = keyof paths;
type Method<P extends Path> = keyof paths[P];

type RequestQueryParams<P extends Path, M extends Method<P>> = paths[P][M] extends {
  parameters: { query?: unknown };
}
  ? paths[P][M]['parameters']['query']
  : undefined;

type RequestPathParams<P extends Path, M extends Method<P>> = paths[P][M] extends {
  parameters: { path: unknown };
}
  ? paths[P][M]['parameters']['path']
  : undefined;

export type ApiResponse<T extends keyof paths, M extends keyof paths[T]> = paths[T][M] extends {
  responses: { 200: { content: { 'application/json': infer R } } };
}
  ? R
  : never;

export type ApiRequest<T extends keyof paths, M extends keyof paths[T]> = paths[T][M] extends {
  requestBody: { content: { 'application/json': infer R } };
}
  ? R
  : never;

export type ApiRequestParams<T extends keyof paths, M extends keyof paths[T]> =
  | (RequestQueryParams<T, M> extends undefined ? never : RequestQueryParams<T, M>)
  | (RequestPathParams<T, M> extends undefined ? never : RequestPathParams<T, M>);
