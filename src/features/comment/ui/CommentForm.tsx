'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateComment, commentFormSchema, type CommentFormSchema } from '../model';
import { Button, useToast } from '@/shared/ui';
import { useSession } from 'next-auth/react';

type CommentFormProps = {
  postId: number;
  disabled?: boolean;
};

export function CommentForm({ postId, disabled = false }: CommentFormProps) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const canComment = isAuthenticated;
  const toast = useToast();

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
          toast.success('작성 성공');
        },
        onError: (error) => {
          toast.error('댓글 작성 실패');
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
            placeholder={isAuthenticated ? '댓글을 입력하세요...' : '로그인이 필요합니다'}
            aria-label='댓글 입력'
            disabled={!canComment || disabled || isPending}
          />
          <Button
            type='submit'
            isPending={isPending}
            disabled={!canComment || disabled}
            size='sm'
            submitType='comment'
          />
        </div>
      </div>
      {errors.content && <p className='text-red-400 text-xs mt-1 mb-2'>{errors.content.message}</p>}
      {!isAuthenticated && (
        <p className='text-blue-300 text-xs mt-1 mb-2 text-center'>
          댓글을 작성하려면 <span className='text-blue-200 font-medium'>로그인</span>이 필요합니다
        </p>
      )}
    </form>
  );
}
