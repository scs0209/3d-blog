import { type ApiRequest, type ApiRequestParams, type ApiResponse, fetcher } from '@/shared/api';

type CreateCommentRequest = ApiRequest<'/api/comments', 'post'>;

export const createComment = (body: CreateCommentRequest) =>
  fetcher({
    url: '/api/comments',
    method: 'post',
    body,
  });

type GetCommentsParams = ApiRequestParams<'/api/comments/{postId}', 'get'>;
export type GetCommentsResponse = ApiResponse<'/api/comments/{postId}', 'get'>;

export const getComments = (params: GetCommentsParams): Promise<GetCommentsResponse> =>
  fetcher({
    url: '/api/comments/{postId}',
    path: { postId: params.postId },
    method: 'get',
  });

type DeleteCommentParams = ApiRequestParams<'/api/comments/individual/{commentId}', 'delete'>;

export const deleteComment = (params: DeleteCommentParams) =>
  fetcher({
    url: '/api/comments/individual/{commentId}',
    path: { commentId: params.commentId },
    method: 'delete',
  });

export type UpdateCommentParams = ApiRequestParams<'/api/comments/individual/{commentId}', 'put'>;
export type UpdateCommentRequest = ApiRequest<'/api/comments/individual/{commentId}', 'put'>;

export const updateComment = (params: UpdateCommentParams, body: UpdateCommentRequest) =>
  fetcher({
    url: '/api/comments/individual/{commentId}',
    path: { commentId: params.commentId },
    method: 'put',
    body,
  });
