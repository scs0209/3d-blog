/** 글 상세·댓글 surface — border는 blogTheme card/chromeBar와 동일 (light: warm, dark: cool) */
const panelBorder = 'border border-[#ff9a3c]/25 dark:border-[#3de8ff]/20';
const cardBorder = 'border border-[#ff9a3c]/20 dark:border-[#3de8ff]/15';
const inputBorder = 'border border-[#ff9a3c]/25 dark:border-[#3de8ff]/20';

const panelSurface =
  'bg-[#1a1424]/94 shadow-[0_24px_64px_rgba(255,154,60,0.12)] backdrop-blur-xl dark:bg-[#0c1018]/94 dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)]';
const cardSurface = 'bg-[#1a1424]/72 backdrop-blur-sm dark:bg-[#0b0e16]/72';

export const blogPostSurface = {
  postSection: `relative overflow-hidden rounded-2xl ${panelBorder} md:bg-[#1a1424]/94 md:shadow-[0_24px_64px_rgba(255,154,60,0.12)] md:backdrop-blur-xl dark:md:bg-[#0c1018]/94 dark:md:shadow-[0_24px_64px_rgba(0,0,0,0.5)]`,
  summaryBox: `rounded-xl ${cardBorder} bg-[#ff9a3c]/8 p-4 dark:bg-[#3de8ff]/6`,
  commentSection: `relative mt-10 max-w-4xl overflow-hidden rounded-2xl px-4 py-8 sm:px-6 md:px-8 ${panelBorder} ${panelSurface}`,
  commentCard: `relative rounded-xl ${cardBorder} ${cardSurface} p-4`,
  commentReplyThread: 'ml-4 mt-3 space-y-2.5',
  commentReplyCard: 'relative rounded-lg bg-[#ff9a3c]/6 px-3 py-2.5 dark:bg-[#3de8ff]/6',
  commentInput: `w-full resize-none rounded-lg ${inputBorder} bg-[#1c0e38]/50 p-3 text-sm leading-relaxed text-[#f5f0e8] placeholder:text-[#c9bfc8] focus:outline-none focus:ring-2 focus:ring-[#ff9a3c]/40 dark:bg-[#070414]/55 dark:text-[#e8eef5] dark:placeholder:text-[#a8b6c8] dark:focus:ring-[#3de8ff]/35`,
  commentInputShell: `overflow-hidden rounded-lg ${inputBorder} bg-[#1c0e38]/50 focus-within:ring-2 focus-within:ring-[#ff9a3c]/40 dark:bg-[#070414]/55 dark:focus-within:ring-[#3de8ff]/35`,
  commentInputField:
    'block w-full resize-none border-0 bg-transparent px-3 pt-3 pb-1 text-sm leading-relaxed text-[#f5f0e8] placeholder:text-[#c9bfc8] focus:outline-none focus:ring-0 dark:text-[#e8eef5] dark:placeholder:text-[#a8b6c8]',
  commentSubmit:
    'inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#ff9a3c]/35 bg-[#ff9a3c]/12 px-2.5 py-1.5 text-xs font-medium text-[#ffd4b0] transition hover:border-[#ff9a3c]/55 hover:bg-[#ff9a3c]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9a3c]/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3de8ff]/30 dark:bg-[#3de8ff]/10 dark:text-[#b8e4ff] dark:hover:border-[#3de8ff]/45 dark:hover:bg-[#3de8ff]/16 dark:focus-visible:ring-[#3de8ff]/35',
  commentFormActions: 'flex justify-end px-3 pb-3 pt-0.5',
  commentActionPrimary:
    'inline-flex items-center gap-1 rounded-lg border border-[#ff9a3c]/35 bg-[#ff9a3c]/12 px-3 py-1.5 text-xs font-medium text-[#ffd4b0] transition hover:border-[#ff9a3c]/55 hover:bg-[#ff9a3c]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9a3c]/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3de8ff]/30 dark:bg-[#3de8ff]/10 dark:text-[#b8e4ff] dark:hover:border-[#3de8ff]/45 dark:hover:bg-[#3de8ff]/16 dark:focus-visible:ring-[#3de8ff]/35',
  commentActionGhost:
    'inline-flex items-center gap-1 rounded-lg border border-[#ff9a3c]/25 bg-transparent px-3 py-1.5 text-xs font-medium text-[#ffb870] transition hover:border-[#ff9a3c]/45 hover:bg-[#ff9a3c]/8 hover:text-[#ffd4b0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9a3c]/35 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3de8ff]/25 dark:text-[#7ec8ff] dark:hover:border-[#3de8ff]/40 dark:hover:bg-[#3de8ff]/8 dark:hover:text-[#b8e4ff]',
  commentDanger:
    'text-xs text-[#ff9a3c]/75 transition hover:text-[#ffb870] hover:underline dark:text-[#3de8ff]/65 dark:hover:text-[#7ec8ff]',
} as const;
