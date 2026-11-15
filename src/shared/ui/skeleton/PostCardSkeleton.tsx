import { blogTheme } from '@/widgets/post/ui/blog-theme';

const BAR = 'animate-pulse bg-white/[0.07]';

export const PostCardSkeleton = () => {
  return (
    <div className={`flex min-h-[11rem] flex-col p-4 ${blogTheme.card}`} aria-hidden>
      <div className={`h-3 w-1/3 ${BAR}`} />
      <div className={`mt-6 h-4 ${BAR}`} />
      <div className={`mt-2 h-4 w-3/4 ${BAR}`} />
      <div className={`mt-auto h-3 w-1/4 ${BAR}`} />
    </div>
  );
};
