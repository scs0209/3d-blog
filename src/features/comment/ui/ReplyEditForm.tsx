'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui';
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
        onSuccess: onCancel,
        onError: () => {
          alert('대댓글 수정 실패');
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
            className='w-full bg-[#232946] border border-fuchsia-400/40 rounded-lg p-3 text-slate-100 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60'
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
          className='border-fuchsia-400/30 text-fuchsia-300 hover:text-fuchsia-200 hover:border-fuchsia-400/50 hover:bg-fuchsia-900/20 bg-none'
        >
          취소
        </Button>
      </div>
    </form>
  );
}
