import * as z from 'zod';

const contentSchema = z
  .string()
  .min(1, {
    message: '댓글 내용을 입력해주세요.',
  })
  .max(1000, {
    message: '댓글은 최대 1000자까지 입력 가능합니다.',
  });

export const createCommentSchema = z.object({
  content: contentSchema,
  postId: z.number().positive({
    message: '유효한 게시글 ID가 필요합니다.',
  }),
  authorId: z.number().positive({
    message: '유효한 작성자 ID가 필요합니다.',
  }),
  parentId: z.number().positive().optional(),
});

export const updateCommentSchema = z.object({
  content: contentSchema,
});

export const deleteCommentSchema = z.object({
  commentId: z.number().positive({
    message: '유효한 댓글 ID가 필요합니다.',
  }),
});

export const getCommentsSchema = z.object({
  postId: z.number().positive({
    message: '유효한 게시글 ID가 필요합니다.',
  }),
});

// Form validation schemas for client-side
export const commentFormSchema = z.object({
  content: contentSchema,
});

export const replyFormSchema = z.object({
  content: contentSchema,
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
export type UpdateCommentSchema = z.infer<typeof updateCommentSchema>;
export type DeleteCommentSchema = z.infer<typeof deleteCommentSchema>;
export type GetCommentsSchema = z.infer<typeof getCommentsSchema>;
export type CommentFormSchema = z.infer<typeof commentFormSchema>;
export type ReplyFormSchema = z.infer<typeof replyFormSchema>;
