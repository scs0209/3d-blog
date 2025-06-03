import { type ApiRequest, type ApiRequestParams, type ApiResponse, fetcher } from '@/shared/api';

type CreateCommentRequest = ApiRequest<'/api/comments', 'post'>;

export const createComment = (body: CreateCommentRequest) =>
  fetcher({
    url: '/api/comments',
    method: 'post',
    body,
  });

type GetCommentsParams = ApiRequestParams<'/api/comments/{postId}', 'get'>;
type GetCommentsResponse = ApiResponse<'/api/comments/{postId}', 'get'>;

export const getComments = (params: GetCommentsParams): Promise<GetCommentsResponse> =>
  fetcher({
    url: '/api/comments/{postId}',
    path: { postId: params.postId },
    method: 'get',
  });
