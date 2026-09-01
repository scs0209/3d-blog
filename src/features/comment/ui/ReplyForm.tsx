'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useCreateComment, replyFormSchema, type ReplyFormSchema } from '../model';
import { useToast } from '@/shared/ui';
import { blogPostSurface } from '@/widgets/post/ui/blog-post-surface';
import { BlogCommentSubmitButton } from './BlogCommentSubmitButton';

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
        <div className={blogPostSurface.commentInputShell}>
          <label htmlFor={`reply-input-${commentId}`} className='sr-only'>
            대댓글 입력
          </label>
          <textarea
            id={`reply-input-${commentId}`}
            {...register('content')}
            className={blogPostSurface.commentInputField}
            rows={2}
            placeholder={!isAuthenticated ? '로그인이 필요합니다' : '대댓글을 입력하세요...'}
            aria-label='대댓글 입력'
            disabled={!canReply || isPending}
          />
          <div className={blogPostSurface.commentFormActions}>
            <BlogCommentSubmitButton isPending={isPending} disabled={!canReply || isPending} />
          </div>
        </div>
        {errors.content && <p className='text-red-400 text-xs mt-1'>{errors.content.message}</p>}
      </form>
    </li>
  );
}
