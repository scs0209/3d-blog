/** 블로그 (posts) 테마 — chrome은 황혼/심해, 본문은 읽기용 고대비 */
export const blogTheme = {
  /* ── Shell ── */
  shell:
    'bg-gradient-to-b from-[#2a1545] via-[#1c0e38] to-[#12082a] text-[#f5f0e8] dark:from-[#000008] dark:via-[#070414] dark:to-[#0a0618] dark:text-[#e8eef5]',
  shellRoot: 'min-h-screen bg-[#1a0f2e] dark:bg-[#000006]',
  bottomVeil:
    'bg-gradient-to-t from-[rgba(255,154,60,0.22)] via-[rgba(138,74,104,0.12)] to-transparent dark:from-[rgba(1,4,12,0.85)] dark:via-[rgba(2,6,14,0.4)] dark:to-transparent',

  /* ── Chrome ── */
  chromeBar:
    'border border-[#ff9a3c]/25 bg-[#1c0e38]/80 shadow-[0_0_32px_rgba(255,154,60,0.12),inset_0_1px_0_rgba(255,200,160,0.15)] backdrop-blur-md dark:border-[#3de8ff]/20 dark:bg-black/40 dark:shadow-[0_0_32px_rgba(61,232,255,0.1),inset_0_1px_0_rgba(255,255,255,0.06)]',
  chromeShine:
    'pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#ff9a3c]/50 to-transparent dark:via-[#3de8ff]/40',
  navBtn:
    'border border-[#ff9a3c]/25 bg-[#2a1545]/60 text-[#f5f0e8] hover:border-[#ff9a3c]/55 hover:bg-[#3d1f5c]/70 hover:shadow-[0_0_16px_rgba(255,154,60,0.15)] dark:border-[#3de8ff]/20 dark:bg-black/35 dark:text-[#e8eef5] dark:hover:border-[#3de8ff]/45 dark:hover:bg-black/50 dark:hover:shadow-[0_0_16px_rgba(61,232,255,0.12)]',
  dropdown:
    'border border-[#ff9a3c]/20 bg-[#1c0e38]/95 backdrop-blur-md dark:border-[#3de8ff]/[0.15] dark:bg-[#070414]/95',
  sidebar:
    'border-l border-[#ff9a3c]/[0.15] bg-[#1c0e38]/85 shadow-[-8px_0_32px_rgba(255,154,60,0.06)] backdrop-blur-md dark:border-[#3de8ff]/[0.12] dark:bg-[#070414]/80 dark:shadow-[-8px_0_32px_rgba(61,232,255,0.05)]',

  /* ── Typography (본문·목록은 거의 흰 글자, 액센트는 링크·라벨만) ── */
  titleGradient:
    'bg-gradient-to-r from-[#fff4e8] via-[#ffc8a0] to-[#ff9a3c] bg-clip-text text-transparent dark:from-[#f4fbff] dark:via-[#b8e4ff] dark:to-[#3de8ff]',
  sectionTitle: 'text-sm font-semibold uppercase tracking-[0.2em] text-[#ffb870] dark:text-[#7ec8ff]',
  sectionLine: 'h-px flex-1 bg-gradient-to-r from-transparent to-[#ff9a3c]/50 dark:to-[#3de8ff]/40',
  sectionLineReverse: 'h-px flex-1 bg-gradient-to-l from-transparent to-[#ff9a3c]/50 dark:to-[#3de8ff]/40',
  labelAccent: 'text-[#ffb870] dark:text-[#7ec8ff]',
  textPrimary: 'text-[#f5f0e8] dark:text-[#e8eef5]',
  textMuted: 'text-[#c9bfc8] dark:text-[#a8b6c8]',
  textAccent: 'text-[#ffb870] dark:text-[#7ec8ff]',

  /* ── Nav ── */
  navActive:
    'border border-[#ff9a3c]/45 bg-[#ff9a3c]/10 text-[#fff4e8] shadow-[0_0_12px_rgba(255,154,60,0.15)] dark:border-[#3de8ff]/40 dark:bg-[#3de8ff]/[0.08] dark:text-[#f4fbff] dark:shadow-[0_0_12px_rgba(61,232,255,0.12)]',
  navIdle:
    'border border-transparent text-[#f5f0e8]/90 hover:bg-[#ff9a3c]/[0.08] dark:text-[#e8eef5]/90 dark:hover:bg-[#3de8ff]/[0.08]',

  /* ── Cards ── */
  card: 'border border-[#ff9a3c]/20 bg-[#1a1424]/88 shadow-[0_4px_24px_rgba(255,154,60,0.08)] backdrop-blur-sm dark:border-[#3de8ff]/[0.15] dark:bg-[#0b0e16]/88 dark:shadow-[0_4px_24px_rgba(61,232,255,0.06)]',
  cardTopGlow:
    'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff9a3c]/70 to-transparent dark:via-[#3de8ff]/60',
  cardHover:
    'hover:border-[#ff9a3c]/45 hover:shadow-[0_0_28px_rgba(255,154,60,0.18)] dark:hover:border-[#3de8ff]/35 dark:hover:shadow-[0_0_28px_rgba(61,232,255,0.14)]',
  categoryPill:
    'rounded-full border border-[#ff9a3c]/30 bg-[#ff9a3c]/10 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-[#ffd4b0] dark:border-[#3de8ff]/30 dark:bg-[#3de8ff]/10 dark:text-[#b8e4ff]',
  listRow:
    'group relative border border-transparent hover:border-[#ff9a3c]/20 hover:bg-[#ff9a3c]/5 dark:hover:border-[#3de8ff]/[0.15] dark:hover:bg-[#3de8ff]/5',
  listAccent:
    'absolute bottom-4 left-0 top-4 w-0.5 rounded-full bg-gradient-to-b from-[#ff9a3c] to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-[#3de8ff]',
  divider: 'border-[#ff9a3c]/[0.12] dark:border-[#3de8ff]/10',

  /* ── Misc ── */
  iconBtn:
    'text-[#f5f0e8]/90 hover:bg-[#ff9a3c]/10 hover:text-[#ffd4b0] dark:text-[#e8eef5]/90 dark:hover:bg-[#3de8ff]/10 dark:hover:text-white',
  dropdownItem: 'text-[#f5f0e8] hover:bg-[#ff9a3c]/10 dark:text-[#e8eef5] dark:hover:bg-[#3de8ff]/[0.08]',
  overlay: 'bg-[#1a0f2e]/70 dark:bg-black/65',
  searchIcon:
    'text-[#ffd4b0] hover:bg-[#ff9a3c]/[0.15] hover:text-[#f5f0e8] dark:text-[#e8eef5] dark:hover:bg-[#3de8ff]/10 dark:hover:text-white',
  searchPanel:
    'border border-[#ff9a3c]/20 bg-[#1c0e38]/95 backdrop-blur-xl dark:border-[#3de8ff]/[0.15] dark:bg-[#070414]/95',
  postSection:
    'md:border md:border-white/12 md:bg-[#1a1424]/94 md:shadow-[0_24px_64px_rgba(0,0,0,0.35)] md:backdrop-blur-xl dark:md:border-white/10 dark:md:bg-[#0c1018]/94 dark:md:shadow-[0_24px_64px_rgba(0,0,0,0.5)]',

  /* ── Post detail / Comments ── */
  tagPill:
    'rounded-full border border-[#ff9a3c]/30 bg-[#ff9a3c]/10 px-3 py-1 text-xs text-[#ffd4b0] dark:border-[#3de8ff]/25 dark:bg-[#3de8ff]/[0.08] dark:text-[#b8e4ff]',
  summaryBox:
    'rounded-xl border border-white/12 bg-black/25 p-4 dark:border-white/10 dark:bg-white/[0.04]',
  commentSection:
    'relative mt-10 max-w-4xl rounded-2xl px-4 py-8 sm:px-6 md:overflow-hidden md:border md:border-white/12 md:bg-[#1a1424]/94 md:px-8 md:shadow-[0_24px_64px_rgba(0,0,0,0.35)] md:backdrop-blur-xl dark:md:border-white/10 dark:md:bg-[#0c1018]/94',
  commentCard:
    'relative rounded-xl border border-white/10 bg-black/20 p-4 dark:border-white/[0.08] dark:bg-white/[0.04]',
  commentReplyCard:
    'relative rounded-lg border border-white/8 bg-black/15 p-3 dark:border-white/[0.06] dark:bg-white/[0.03]',
  commentInput:
    'w-full resize-none rounded-lg border border-white/15 bg-black/30 p-3 text-sm leading-relaxed text-[#f5f0e8] placeholder:text-[#c9bfc8] focus:outline-none focus:ring-2 focus:ring-[#ff9a3c]/40 dark:border-white/10 dark:bg-white/[0.05] dark:text-[#e8eef5] dark:placeholder:text-[#a8b6c8] dark:focus:ring-[#3de8ff]/35',
  commentLink:
    'text-xs text-[#ffb870] hover:text-[#ffd4b0] hover:underline dark:text-[#7ec8ff] dark:hover:text-[#b8e4ff]',
  commentReplyBorder: 'border-l-2 border-[#ff9a3c]/25 pl-4 dark:border-[#3de8ff]/20',
} as const;
