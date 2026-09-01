/** 댓글 좋아요/싫어요 — blog warm/cool accent */
export const likeReactionTheme = {
  buttonBase:
    'rounded-full p-1 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9a3c]/35 dark:focus-visible:ring-[#3de8ff]/35',
  likeIdle:
    'text-[#ffb870]/85 hover:bg-[#ff9a3c]/10 hover:text-[#ffd4b0] dark:text-[#7ec8ff]/85 dark:hover:bg-[#3de8ff]/10 dark:hover:text-[#b8e4ff]',
  likeActive: 'bg-[#ff9a3c]/15 text-[#ffb870] dark:bg-[#3de8ff]/12 dark:text-[#7ec8ff]',
  dislikeIdle:
    'text-[#c9bfc8]/85 hover:bg-white/8 hover:text-[#f5f0e8] dark:text-[#a8b6c8]/85 dark:hover:bg-white/8 dark:hover:text-[#e8eef5]',
  dislikeActive: 'bg-white/10 text-[#c9bfc8] dark:bg-white/8 dark:text-[#a8b6c8]',
  countLike: 'text-xs text-[#ffb870]/90 transition-colors dark:text-[#7ec8ff]/90',
  countDislike: 'text-xs text-[#c9bfc8]/90 transition-colors dark:text-[#a8b6c8]/90',
  countPulse: 'rounded px-1',
  skeletonLike: 'inline-block h-3 w-4 rounded bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/20',
  skeletonDislike: 'inline-block h-3 w-4 rounded bg-white/15',
} as const;
