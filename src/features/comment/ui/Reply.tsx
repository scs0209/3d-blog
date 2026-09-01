'use client';

import { useState } from 'react';
import type { ReplyType } from '@/entities/comment/model/types';
import { LikeDislikeButtons } from '@/features/like/ui';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { blogPostSurface } from '@/widgets/post/ui/blog-post-surface';
import { formatDateToYMD } from '@/shared/utils';
import { useDeleteComment } from '../model';
import { ReplyEditForm } from './ReplyEditForm';
import { useSession } from 'next-auth/react';
import { useToast } from '@/shared/ui';
import { getDeleteCommentErrorMessage } from '../lib/get-delete-comment-error-message';

type ReplyProps = {
  reply: ReplyType;
  postId: number;
};

export function Reply({ reply, postId }: ReplyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  const toast = useToast();
  const { deleteComment, isPending: isDeleting } = useDeleteComment();
  const isAuthor = Number(session?.user?.id) === reply.author?.id;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canManage = isAuthor || isAdmin;

  const handleDelete = () => {
    deleteComment(
      { commentId: reply.id ?? 0, postId },
      {
        onSuccess: () => {
          toast.success('대댓글을 삭제했습니다');
        },
        onError: (error) => {
          toast.error(getDeleteCommentErrorMessage(error));
        },
      },
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <li>
      <article className={blogPostSurface.commentReplyCard}>
        <header className='mb-1 flex items-center gap-2'>
          <address className={`not-italic font-bold ${blogTheme.textAccent}`}>{reply.author?.name}</address>
          <time className={`text-xs ${blogTheme.textMuted}`} dateTime={reply.createdAt}>
            {formatDateToYMD(reply.createdAt ?? '')}
          </time>
        </header>
        {isEditing ? (
          <ReplyEditForm reply={reply} postId={postId} onCancel={handleCancelEdit} />
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
                    className={blogPostSurface.commentDanger}
                    type='button'
                    aria-label='대댓글 삭제'
                    disabled={isDeleting}
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
