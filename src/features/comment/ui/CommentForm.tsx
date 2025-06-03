'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateComment, commentFormSchema, type CommentFormSchema } from '../model';
import { useSession } from 'next-auth/react';

type CommentFormProps = {
  postId: number;
  disabled?: boolean;
};

export function CommentForm({ postId, disabled = false }: CommentFormProps) {
  const { data: session } = useSession();
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
        authorId: Number(session?.user?.id),
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
          <button
            type='submit'
            className='absolute bottom-2.5 right-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg md:shadow-[0_0_8px_#7dd3fc55] transition-all duration-300 disabled:opacity-60 text-xs transform hover:scale-110 hover:rotate-1 active:scale-95 active:rotate-0'
            style={{ fontSize: '0.85rem', marginBottom: '6px', marginRight: '6px' }}
            aria-label='댓글 등록'
            disabled={disabled || isPending}
          >
            {isPending ? '등록중...' : '등록'}
          </button>
        </div>
      </div>
      {errors.content && <p className='text-red-400 text-xs mt-1 mb-2'>{errors.content.message}</p>}
    </form>
  );
}
