'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateComment, replyFormSchema, type ReplyFormSchema } from '../model';

type ReplyFormProps = {
  commentId?: number;
  postId: number;
  disabled?: boolean;
};

export function ReplyForm({ commentId, postId, disabled = false }: ReplyFormProps) {
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
        },
        onError: (error) => {
          alert('대댓글 작성 실패');
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
            className='w-full bg-[#232946] border border-blue-400/40 rounded-lg p-2 pr-16 text-slate-100 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/60'
            rows={2}
            placeholder={'대댓글을 입력하세요...'}
            aria-label='대댓글 입력'
            disabled={disabled || isPending}
          />
          <button
            type='submit'
            className='absolute bottom-2.5 right-2.5 bg-fuchsia-700 hover:bg-fuchsia-600 text-white font-bold px-2.5 py-1 rounded-lg md:shadow-[0_0_8px_#f472b655] transition-all duration-300 disabled:opacity-60 text-xs transform hover:scale-110 hover:rotate-1 active:scale-95'
            style={{ fontSize: '0.8rem', marginBottom: '6px', marginRight: '6px' }}
            aria-label='대댓글 등록'
            disabled={disabled || isPending}
          >
            {isPending ? '등록중...' : '등록'}
          </button>
        </div>
        {errors.content && <p className='text-red-400 text-xs mt-1'>{errors.content.message}</p>}
      </form>
    </li>
  );
}
