'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateComment, commentFormSchema, type CommentFormSchema } from '../model';
import { Button } from '@/shared/ui';

type CommentFormProps = {
  postId: number;
  disabled?: boolean;
};

export function CommentForm({ postId, disabled = false }: CommentFormProps) {
  const { createComment, isPending } = useCreateComment();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormSchema>({
    resolver: zodResolver(commentFormSchema),
  });

  const onSubmit = async (data: CommentFormSchema) => {
    if (!data.content.trim()) {
      return;
    }

    createComment(
      {
        postId,
        content: data.content.trim(),
      },
      {
        onSuccess: () => {
          reset();
        },
        onError: (error) => {
          alert('댓글 작성 실패');
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='relative flex items-start gap-2 mb-6'>
        <div className='relative flex-1'>
          <label htmlFor='comment-input' className='sr-only'>
            댓글 입력
          </label>
          <textarea
            id='comment-input'
            {...register('content')}
            className='w-full bg-[#232946] border border-blue-400/40 rounded-lg p-3 pr-16 text-slate-100 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/60 md:shadow-[0_0_8px_#7dd3fc33]'
            rows={3}
            placeholder={'댓글을 입력하세요...'}
            aria-label='댓글 입력'
            disabled={disabled || isPending}
          />
          <Button type='submit' isPending={isPending} disabled={disabled} size='sm' submitType='comment' />
        </div>
      </div>
      {errors.content && <p className='text-red-400 text-xs mt-1 mb-2'>{errors.content.message}</p>}
    </form>
  );
}
