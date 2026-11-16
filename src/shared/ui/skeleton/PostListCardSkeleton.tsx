const BAR = 'animate-pulse bg-white/[0.07]';

export const PostListCardSkeleton = () => {
  return (
    <div className='grid grid-cols-1 gap-x-6 gap-y-2 py-4 sm:grid-cols-[6.5rem_1fr_auto] sm:items-center' aria-hidden>
      <div className={`h-3 w-20 ${BAR}`} />
      <div className={`h-5 w-4/5 ${BAR}`} />
      <div className={`h-3 w-24 ${BAR}`} />
    </div>
  );
};
