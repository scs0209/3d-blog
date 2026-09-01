'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/shared/ui';
import { blogPostSurface } from '@/widgets/post/ui/blog-post-surface';
import { useUpdateComment } from '../model';
import type { Comment } from '@/entities/comment/model/types';

// 수정 폼 스키마
const updateCommentSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해주세요').max(1000, '댓글은 1000자 이내로 작성해주세요').trim(),
});

type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;

type CommentEditFormProps = {
  comment: Comment;
  postId: number;
  onCancel: () => void;
};

export function CommentEditForm({ comment, postId, onCancel }: CommentEditFormProps) {
  const { updateComment, isPending: isUpdating } = useUpdateComment();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UpdateCommentFormData>({
    resolver: zodResolver(updateCommentSchema),
    defaultValues: {
      content: comment.content,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: UpdateCommentFormData) => {
    updateComment(
      { params: { commentId: comment.id ?? 0 }, body: { content: data.content }, postId },
      {
        onSuccess: () => {
          toast.success('수정 성공');
          onCancel();
        },
        onError: () => {
          toast.error('수정 실패');
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mb-2'>
      <Controller
        name='content'
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            className={blogPostSurface.commentInput}
            rows={3}
            placeholder='댓글을 수정하세요...'
            disabled={isUpdating}
          />
        )}
      />
      {errors.content && <p className='text-red-400 text-xs mt-1'>{errors.content.message}</p>}
      <div className='mt-2 flex gap-2'>
        <button
          type='submit'
          disabled={!isValid || isUpdating}
          className={blogPostSurface.commentActionPrimary}
        >
          {isUpdating ? '저장중...' : '저장'}
        </button>
        <button
          type='button'
          onClick={onCancel}
          disabled={isUpdating}
          className={blogPostSurface.commentActionGhost}
        >
          취소
        </button>
      </div>
    </form>
  );
}
