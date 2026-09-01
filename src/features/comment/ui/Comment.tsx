'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { LikeDislikeButtons } from '@/features/like/ui';
import { useToast } from '@/shared/ui';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { blogPostSurface } from '@/widgets/post/ui/blog-post-surface';
import { Reply } from './Reply';
import { ReplyForm } from './ReplyForm';
import { CommentEditForm } from './CommentEditForm';
import type { Comment, ReplyType } from '@/entities/comment/model/types';
import { formatDateToYMD } from '@/shared/utils';
import { getDeleteCommentErrorMessage } from '../lib/get-delete-comment-error-message';
import { useDeleteComment } from '../model';

type CommentProps = {
  comment?: Comment;
  replies?: ReplyType[];
  postId: number;
};

export function Comment({ comment, replies = [], postId }: CommentProps) {
  const { data: session } = useSession();
  const toast = useToast();
  const { deleteComment, isPending: isDeleting } = useDeleteComment();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = (commentId: number) => {
    deleteComment(
      { commentId, postId },
      {
        onSuccess: () => {
          toast.success('댓글을 삭제했습니다');
        },
        onError: (error) => {
          toast.error(getDeleteCommentErrorMessage(error));
        },
      },
    );
  };

  if (!comment) {
    return null;
  }

  const isAuthor = Number(session?.user?.id) === comment.author?.id;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canManage = isAuthor || isAdmin;

  return (
    <li>
      <article className={blogPostSurface.commentCard}>
        <header className='mb-1 flex items-center gap-2'>
          <address className={`not-italic font-bold ${blogTheme.textAccent}`}>{comment.author?.name}</address>
          <time className={`text-xs ${blogTheme.textMuted}`} dateTime={comment.createdAt}>
            {formatDateToYMD(comment.createdAt ?? '')}
          </time>
        </header>

        {isEditing ? (
          <CommentEditForm comment={comment} postId={postId} onCancel={() => setIsEditing(false)} />
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
                  className={blogPostSurface.commentDanger}
                  type='button'
                  aria-label='댓글 삭제'
                  disabled={isDeleting}
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

        <ul className={blogPostSurface.commentReplyThread}>
          {replies.length > 0 && replies.map((reply) => <Reply key={reply.id} reply={reply} postId={postId} />)}
          <ReplyForm commentId={comment.id} postId={postId} />
        </ul>
      </article>
    </li>
  );
}
