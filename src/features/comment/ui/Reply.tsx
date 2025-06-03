'use client';

import type { ReplyType } from '@/entities/comment/model/types';
import { LikeDislikeButtons } from '@/features/like/ui';
import { formatDateToYMD } from '@/shared/utils';
import { useDeleteComment } from '../model';

type ReplyProps = {
  reply: ReplyType;
};

export function Reply({ reply }: ReplyProps) {
  const { deleteComment } = useDeleteComment();

  const handleDelete = () => {
    deleteComment({ commentId: reply.id ?? 0 });
  };

  return (
    <li>
      <article className='bg-gradient-to-br from-slate-700/50 to-slate-600/30 backdrop-blur-sm border border-slate-600/40 md:from-[#232946]/80 md:to-[#181c2a]/40 md:border-fuchsia-400/20 rounded-lg p-3 relative'>
        <header className='flex items-center gap-2 mb-1'>
          <address className='not-italic font-bold text-fuchsia-200'>{reply.author?.name}</address>
          <time className='text-xs text-fuchsia-300' dateTime={reply.createdAt}>
            {formatDateToYMD(reply.createdAt ?? '')}
          </time>
        </header>
        <p className='text-slate-100 mb-2'>{reply.content}</p>
        <div className='flex gap-2 items-center justify-between mt-2'>
          <div className='flex gap-2 items-center'>
            <button
              className='text-xs text-fuchsia-400 hover:text-fuchsia-300 hover:underline'
              type='button'
              aria-label='대댓글 삭제'
              onClick={handleDelete}
            >
              삭제
            </button>
          </div>
          <div className='flex items-center gap-1'>
            <LikeDislikeButtons initialLikes={reply.likes} initialDislikes={reply.dislikes} size={15} />
          </div>
        </div>
      </article>
    </li>
  );
}
