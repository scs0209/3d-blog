'use client';

import { useState } from 'react';
import type { ReplyType } from '@/entities/comment/model/types';
import { LikeDislikeButtons } from '@/features/like/ui';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { formatDateToYMD } from '@/shared/utils';
import { useDeleteComment } from '../model';
import { ReplyEditForm } from './ReplyEditForm';
import { useSession } from 'next-auth/react';

type ReplyProps = {
  reply: ReplyType;
};

export function Reply({ reply }: ReplyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  const { deleteComment } = useDeleteComment();
  const isAuthor = Number(session?.user?.id) === reply.author?.id;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canManage = isAuthor || isAdmin;

  const handleDelete = () => {
    deleteComment({ commentId: reply.id ?? 0 });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <li>
      <article className={blogTheme.commentReplyCard}>
        <header className='mb-1 flex items-center gap-2'>
          <address className={`not-italic font-bold ${blogTheme.textAccent}`}>{reply.author?.name}</address>
          <time className={`text-xs ${blogTheme.textMuted}`} dateTime={reply.createdAt}>
            {formatDateToYMD(reply.createdAt ?? '')}
          </time>
        </header>
        {isEditing ? (
          <ReplyEditForm reply={reply} onCancel={handleCancelEdit} />
        ) : (
          <>
            <p className={`mb-2 ${blogTheme.textPrimary}`}>{reply.content}</p>
            <div className='mt-2 flex items-center justify-between gap-2'>
              {canManage && (
                <div className='flex items-center gap-2'>
                  <button className={blogTheme.commentLink} type='button' aria-label='대댓글 수정' onClick={handleEdit}>
                    수정
                  </button>
                  <button
                    className='text-xs text-rose-400 hover:text-rose-300 hover:underline'
                    type='button'
                    aria-label='대댓글 삭제'
                    onClick={handleDelete}
                  >
                    삭제
                  </button>
                </div>
              )}
              <div className='flex items-center gap-1'>
                <LikeDislikeButtons id={reply.id ?? 0} size={15} />
              </div>
            </div>
          </>
        )}
      </article>
    </li>
  );
}
