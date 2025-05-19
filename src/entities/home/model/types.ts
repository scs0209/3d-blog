import type { ApiRequest, ApiResponse } from '@/shared/api/types';

/**
 * GET /api/posts 요청의 응답 타입
 * 게시물 목록을 포함합니다.
 */
export type PostsResponse = ApiResponse<'/api/posts', 'get'>;
/**
 * POST /api/posts 요청의 본문 타입
 * 게시물 생성 시 사용됩니다.
 */
export type CreatePostReq = ApiRequest<'/api/posts', 'post'>;

/**
 * 그룹화 유틸 함수: 배열을 특정 키 값을 기준으로 그룹화합니다.
 *
 * @template T
 * @param {T[]} array - 그룹화할 배열
 * @param {(item: T) => string | number} keyFn - 그룹화 기준이 될 키를 반환하는 함수
 * @returns {Record<string | number, T[]>} 그룹화된 객체
 *
 * @example
 * const data = [
 *   { category: 'fruit', name: 'apple' },
 *   { category: 'fruit', name: 'banana' },
 *   { category: 'vegetable', name: 'carrot' }
 * ];
 *
 * const grouped = groupBy(data, item => item.category);
 * console.log(grouped);
 * // Output:
 * // {
 * //   fruit: [
 * //     { category: 'fruit', name: 'apple' },
 * //     { category: 'fruit', name: 'banana' }
 * //   ],
 * //   vegetable: [
 * //     { category: 'vegetable', name: 'carrot' }
 * //   ]
 * // }
 */
export const groupBy = <T>(array: T[], keyFn: (item: T) => string | number): Record<string | number, T[]> => {
  return array.reduce((acc: Record<string | number, T[]>, item: T) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key]?.push(item);
    return acc;
  }, {});
};
