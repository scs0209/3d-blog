'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { blogTheme } from '@/widgets/post/ui/blog-theme';

type PostBackButtonProps = {
  href: string;
  label?: string;
};

export const PostBackButton = ({ href, label = '목록으로' }: PostBackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(href);
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={`mb-10 inline-flex items-center gap-2 py-1 text-[14px] text-[#8d98a3] transition-colors hover:text-white ${blogTheme.focus}`}
      aria-label={`${label}로 돌아가기`}
    >
      <ArrowLeft size={14} className={blogTheme.textAccent} aria-hidden />
      <span>{label}</span>
    </button>
  );
};
