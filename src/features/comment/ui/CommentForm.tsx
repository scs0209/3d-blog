'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateComment, commentFormSchema, type CommentFormSchema } from '../model';
import { Button, useToast } from '@/shared/ui';
import { useSession } from 'next-auth/react';
import { blogTheme } from '@/widgets/post/ui/blog-theme';

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
            className={`${blogTheme.commentInput} pr-16`}
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
        <p className={`mt-1 mb-2 text-center text-xs ${blogTheme.textMuted}`}>
          댓글을 작성하려면 <span className={`font-medium ${blogTheme.textAccent}`}>로그인</span>이 필요합니다
        </p>
      )}
    </form>
  );
}
