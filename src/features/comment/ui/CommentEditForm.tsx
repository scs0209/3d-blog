'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, useToast } from '@/shared/ui';
import { useUpdateComment } from '../model';
import type { Comment } from '@/entities/comment/model/types';

// 수정 폼 스키마
const updateCommentSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해주세요').max(1000, '댓글은 1000자 이내로 작성해주세요').trim(),
});

type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;

type CommentEditFormProps = {
  comment: Comment;
  onCancel: () => void;
};

export function CommentEditForm({ comment, onCancel }: CommentEditFormProps) {
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
      { params: { commentId: comment.id ?? 0 }, body: { content: data.content } },
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
            className='w-full bg-[#232946] border border-blue-400/40 rounded-lg p-3 text-slate-100 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/60'
            rows={3}
            placeholder='댓글을 수정하세요...'
            disabled={isUpdating}
          />
        )}
      />
      {errors.content && <p className='text-red-400 text-xs mt-1'>{errors.content.message}</p>}
      <div className='flex gap-2 mt-2'>
        <Button type='submit' size='sm' variant='primary' loading={isUpdating} disabled={!isValid || isUpdating}>
          저장
        </Button>
        <Button
          type='button'
          size='sm'
          variant='primary'
          onClick={onCancel}
          disabled={isUpdating}
          className='border-blue-400/30 text-blue-300 hover:text-blue-200 hover:border-blue-400/50 hover:bg-blue-900/20 bg-none'
        >
          취소
        </Button>
      </div>
    </form>
  );
}
