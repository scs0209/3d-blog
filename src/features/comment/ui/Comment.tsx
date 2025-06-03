'use client';

import { LikeDislikeButtons } from '@/features/like/ui';
import { Reply } from './Reply';
import { ReplyForm } from './ReplyForm';
import type { Comment, ReplyType } from '@/entities/comment/model/types';
import { formatDateToYMD } from '@/shared/utils';
import { useDeleteComment } from '../model';

type CommentProps = {
  comment?: Comment;
  replies?: ReplyType[];
  postId: number;
};

export function Comment({ comment, replies = [], postId }: CommentProps) {
  const { deleteComment } = useDeleteComment();

  const handleDelete = (commentId: number) => {
    deleteComment({ commentId });
  };

  return (
    <li>
      <article className='bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm border border-slate-600/50 md:from-[#181c2a]/80 md:to-[#232946]/60 md:border-blue-400/20 rounded-xl p-4 md:shadow-[0_0_8px_#7dd3fc22] relative'>
        <header className='flex items-center gap-2 mb-1'>
          <address className='not-italic font-bold text-blue-200'>{comment?.author?.name}</address>
          <time className='text-xs text-blue-300' dateTime={comment?.createdAt}>
            {formatDateToYMD(comment?.createdAt ?? '')}
          </time>
        </header>
        <p className='text-slate-100 mb-2'>{comment?.content}</p>
        <div className='flex gap-2 items-center justify-between mt-2'>
          <div className='flex gap-2 items-center'>
            <button
              type='button'
              aria-label='답글 입력창 열기'
              aria-expanded='false'
              aria-controls={`reply-${comment?.id}`}
              className='text-xs text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1'
            >
              <span>답글</span>
              <span aria-hidden>▼</span>
            </button>
            <button
              className='text-xs text-fuchsia-400 hover:text-fuchsia-300 hover:underline'
              type='button'
              aria-label='댓글 삭제'
              onClick={() => handleDelete(comment?.id ?? 0)}
            >
              삭제
            </button>
          </div>
          <div className='flex items-center gap-1'>
            <LikeDislikeButtons initialLikes={comment?.likes} initialDislikes={comment?.dislikes} />
          </div>
        </div>

        {/* 대댓글 영역 */}
        <ul className='mt-4 space-y-3 pl-4 border-l-2 border-slate-600/60 md:border-blue-900/40'>
          {replies.length > 0 && replies.map((reply) => <Reply key={reply.id} reply={reply} />)}
          <ReplyForm commentId={comment?.id} postId={postId} />
        </ul>
      </article>
    </li>
  );
}
