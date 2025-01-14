import { ApiRequest, ApiResponse } from '@/shared/api/types';

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
