import type { paths } from './openapi-types';

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
