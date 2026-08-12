'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { LikeDislikeButtons } from '@/features/like/ui';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { Reply } from './Reply';
import { ReplyForm } from './ReplyForm';
import { CommentEditForm } from './CommentEditForm';
import type { Comment, ReplyType } from '@/entities/comment/model/types';
import { formatDateToYMD } from '@/shared/utils';
import { useDeleteComment } from '../model';

type CommentProps = {
  comment?: Comment;
  replies?: ReplyType[];
  postId: number;
};

export function Comment({ comment, replies = [], postId }: CommentProps) {
  const { data: session } = useSession();
  const { deleteComment } = useDeleteComment();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = (commentId: number) => {
    deleteComment({ commentId });
  };

  if (!comment) {
    return null;
  }

  const isAuthor = Number(session?.user?.id) === comment.author?.id;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canManage = isAuthor || isAdmin;

  return (
    <li>
      <article className={blogTheme.commentCard}>
        <header className='mb-1 flex items-center gap-2'>
          <address className={`not-italic font-bold ${blogTheme.textAccent}`}>{comment.author?.name}</address>
          <time className={`text-xs ${blogTheme.textMuted}`} dateTime={comment.createdAt}>
            {formatDateToYMD(comment.createdAt ?? '')}
          </time>
        </header>

        {isEditing ? (
          <CommentEditForm comment={comment} onCancel={() => setIsEditing(false)} />
        ) : (
          <p className={`mb-2 ${blogTheme.textPrimary}`}>{comment.content}</p>
        )}

        {!isEditing && (
          <div className='mt-2 flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <button
                type='button'
                aria-label='답글 입력창 열기'
                aria-expanded='false'
                aria-controls={`reply-${comment.id}`}
                className={`flex items-center gap-1 ${blogTheme.commentLink}`}
              >
                <span>답글</span>
                <span aria-hidden>▼</span>
              </button>
              {canManage && (
                <button
                  className={blogTheme.commentLink}
                  type='button'
                  aria-label='댓글 수정'
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </button>
              )}
              {canManage && (
                <button
                  className='text-xs text-rose-400 hover:text-rose-300 hover:underline'
                  type='button'
                  aria-label='댓글 삭제'
                  onClick={() => handleDelete(comment.id ?? 0)}
                >
                  삭제
                </button>
              )}
            </div>
            <div className='flex items-center gap-1'>
              <LikeDislikeButtons id={comment.id ?? 0} />
            </div>
          </div>
        )}

        <ul className={`mt-4 space-y-3 ${blogTheme.commentReplyBorder}`}>
          {replies.length > 0 && replies.map((reply) => <Reply key={reply.id} reply={reply} />)}
          <ReplyForm commentId={comment.id} postId={postId} />
        </ul>
      </article>
    </li>
  );
}
