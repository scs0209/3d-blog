'use client';

import { Loader2, Send } from 'lucide-react';
import { blogPostSurface } from '@/widgets/post/ui/blog-post-surface';

type BlogCommentSubmitButtonProps = {
  isPending?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
};

export const BlogCommentSubmitButton = ({
  isPending = false,
  disabled = false,
  className = '',
  label = '등록',
}: BlogCommentSubmitButtonProps) => {
  return (
    <button
      type='submit'
      disabled={disabled || isPending}
      aria-busy={isPending}
      className={`${blogPostSurface.commentSubmit} ${className}`}
    >
      {isPending ? (
        <>
          <Loader2 className='h-3 w-3 animate-spin' aria-hidden />
          <span>등록중...</span>
        </>
      ) : (
        <>
          <Send className='h-3 w-3' aria-hidden />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
