'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useCreateComment, replyFormSchema, type ReplyFormSchema } from '../model';
import { Button, useToast } from '@/shared/ui';

type ReplyFormProps = {
  commentId?: number;
  postId: number;
};

export function ReplyForm({ commentId, postId }: ReplyFormProps) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const canReply = isAuthenticated;
  const toast = useToast();

  const { createComment, isPending } = useCreateComment();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyFormSchema>({
    resolver: zodResolver(replyFormSchema),
  });

  const onSubmit = async (data: ReplyFormSchema) => {
    if (!data.content.trim()) {
      return;
    }

    createComment(
      {
        postId,
        content: data.content.trim(),
        parentId: Number(commentId),
      },
      {
        onSuccess: () => {
          reset();
          toast.success('작성 성공');
        },
        onError: (error) => {
          toast.error('작성 실패');
        },
      },
    );
  };

  return (
    <li className='mt-2'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='relative flex-1'>
          <label htmlFor={`reply-input-${commentId}`} className='sr-only'>
            대댓글 입력
          </label>
          <textarea
            id={`reply-input-${commentId}`}
            {...register('content')}
            className='w-full bg-[#232946] border border-blue-400/40 rounded-lg p-2 pr-14 text-slate-100 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/60'
            rows={2}
            placeholder={!isAuthenticated ? '로그인이 필요합니다' : '대댓글을 입력하세요...'}
            aria-label='대댓글 입력'
            disabled={!canReply || isPending}
          />
          <Button type='submit' isPending={isPending} disabled={!canReply || isPending} size='sm' submitType='reply' />
        </div>
        {errors.content && <p className='text-red-400 text-xs mt-1'>{errors.content.message}</p>}
      </form>
    </li>
  );
}
