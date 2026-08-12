'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, useToast } from '@/shared/ui';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { useUpdateComment } from '../model';
import type { ReplyType } from '@/entities/comment/model/types';

// 수정 폼 스키마
const updateReplySchema = z.object({
  content: z.string().min(1, '대댓글 내용을 입력해주세요').max(1000, '대댓글은 1000자 이내로 작성해주세요').trim(),
});

type UpdateReplyFormData = z.infer<typeof updateReplySchema>;

type ReplyEditFormProps = {
  reply: ReplyType;
  onCancel: () => void;
};

export function ReplyEditForm({ reply, onCancel }: ReplyEditFormProps) {
  const { updateComment, isPending: isUpdating } = useUpdateComment();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UpdateReplyFormData>({
    resolver: zodResolver(updateReplySchema),
    defaultValues: {
      content: reply.content,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: UpdateReplyFormData) => {
    updateComment(
      { params: { commentId: reply.id ?? 0 }, body: { content: data.content } },
      {
        onSuccess: () => {
          toast.success('수정 성공');
          onCancel();
        },
        onError: () => {
          toast.error('대댓글 수정 실패');
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
            className={blogTheme.commentInput}
            rows={2}
            placeholder='대댓글을 수정하세요...'
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
          className={`border-[#ff9a3c]/30 bg-transparent text-[#ffb870] hover:border-[#ff9a3c]/50 hover:bg-[#ff9a3c]/10 hover:text-[#ffc8a0] dark:border-[#3de8ff]/30 dark:text-[#3de8ff] dark:hover:border-[#3de8ff]/50 dark:hover:bg-[#3de8ff]/10 dark:hover:text-[#7ec8ff]`}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
