/** 댓글 좋아요/싫어요 — blog warm/cool accent */
export const likeReactionTheme = {
  buttonBase:
    'rounded-full p-1 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4de3ff]/35',
  likeIdle: 'text-[#4de3ff]/85 hover:bg-[#4de3ff]/10 hover:text-[#e9edf1]',
  likeActive: 'bg-[#4de3ff]/15 text-[#4de3ff]',
  dislikeIdle: 'text-[#8d98a3]/85 hover:bg-white/8 hover:text-[#e9edf1]',
  dislikeActive: 'bg-white/10 text-[#8d98a3]',
  countLike: 'text-xs text-[#4de3ff]/90 transition-colors',
  countDislike: 'text-xs text-[#8d98a3]/90 transition-colors',
  countPulse: 'rounded px-1',
  skeletonLike: 'inline-block h-3 w-4 rounded bg-[#4de3ff]/20',
  skeletonDislike: 'inline-block h-3 w-4 rounded bg-white/15',
} as const;
