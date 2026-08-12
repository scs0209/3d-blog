/** 블로그 (posts) 테마 — light: 황혼(golden hour), dark: 심해(deep space) */
export const blogTheme = {
  /* ── Shell ── */
  shell:
    'bg-gradient-to-b from-[#2a1545] via-[#1c0e38] to-[#12082a] text-[#ffe8d0] dark:from-[#000008] dark:via-[#070414] dark:to-[#0a0618] dark:text-[#c8e8ff]',
  shellRoot: 'min-h-screen bg-[#1a0f2e] dark:bg-[#000006]',
  bottomVeil:
    'bg-gradient-to-t from-[rgba(255,154,60,0.22)] via-[rgba(138,74,104,0.12)] to-transparent dark:from-[rgba(1,4,12,0.85)] dark:via-[rgba(2,6,14,0.4)] dark:to-transparent',

  /* ── Chrome ── */
  chromeBar:
    'border border-[#ff9a3c]/25 bg-[#1c0e38]/80 shadow-[0_0_32px_rgba(255,154,60,0.12),inset_0_1px_0_rgba(255,200,160,0.15)] backdrop-blur-md dark:border-[#3de8ff]/20 dark:bg-black/40 dark:shadow-[0_0_32px_rgba(61,232,255,0.1),inset_0_1px_0_rgba(255,255,255,0.06)]',
  chromeShine:
    'pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#ff9a3c]/50 to-transparent dark:via-[#3de8ff]/40',
  navBtn:
    'border border-[#ff9a3c]/25 bg-[#2a1545]/60 text-[#ffe8d0] hover:border-[#ff9a3c]/55 hover:bg-[#3d1f5c]/70 hover:shadow-[0_0_16px_rgba(255,154,60,0.15)] dark:border-[#3de8ff]/20 dark:bg-black/35 dark:text-[#c8e8ff] dark:hover:border-[#3de8ff]/45 dark:hover:bg-black/50 dark:hover:shadow-[0_0_16px_rgba(61,232,255,0.12)]',
  dropdown:
    'border border-[#ff9a3c]/20 bg-[#1c0e38]/95 backdrop-blur-md dark:border-[#3de8ff]/[0.15] dark:bg-[#070414]/95',
  sidebar:
    'border-l border-[#ff9a3c]/[0.15] bg-[#1c0e38]/85 shadow-[-8px_0_32px_rgba(255,154,60,0.06)] backdrop-blur-md dark:border-[#3de8ff]/[0.12] dark:bg-[#070414]/80 dark:shadow-[-8px_0_32px_rgba(61,232,255,0.05)]',

  /* ── Typography ── */
  titleGradient:
    'bg-gradient-to-r from-[#ffc8a0] via-[#ff9a3c] to-[#e878a0] bg-clip-text text-transparent dark:from-[#3de8ff] dark:via-[#7ec8ff] dark:to-[#818cf8]',
  sectionTitle:
    'text-sm font-semibold uppercase tracking-[0.2em] text-[#ff9a3c] dark:text-[#3de8ff]',
  sectionLine:
    'h-px flex-1 bg-gradient-to-r from-transparent to-[#ff9a3c]/50 dark:to-[#3de8ff]/40',
  sectionLineReverse:
    'h-px flex-1 bg-gradient-to-l from-transparent to-[#ff9a3c]/50 dark:to-[#3de8ff]/40',
  labelAccent: 'text-[#ff9a3c] dark:text-[#3de8ff]',
  textPrimary: 'text-[#ffe8d0] dark:text-[#c8e8ff]',
  textMuted: 'text-[#d4a8c0]/85 dark:text-[#7ec8ff]/75',
  textAccent: 'text-[#ffb870] dark:text-[#3de8ff]',

  /* ── Nav ── */
  navActive:
    'border border-[#ff9a3c]/45 bg-[#ff9a3c]/10 text-[#ffc8a0] shadow-[0_0_12px_rgba(255,154,60,0.15)] dark:border-[#3de8ff]/40 dark:bg-[#3de8ff]/[0.08] dark:text-[#3de8ff] dark:shadow-[0_0_12px_rgba(61,232,255,0.12)]',
  navIdle:
    'border border-transparent text-[#ffe8d0]/85 hover:bg-[#ff9a3c]/[0.08] dark:text-[#c8e8ff]/85 dark:hover:bg-[#3de8ff]/[0.08]',

  /* ── Cards ── */
  card:
    'border border-[#ff9a3c]/20 bg-gradient-to-br from-[#2a1545]/90 via-[#1c0e38]/80 to-[#12082a]/90 shadow-[0_4px_24px_rgba(255,154,60,0.08)] backdrop-blur-sm dark:border-[#3de8ff]/[0.15] dark:from-[#0a0618]/90 dark:via-[#070414]/85 dark:to-[#000008]/90 dark:shadow-[0_4px_24px_rgba(61,232,255,0.06)]',
  cardTopGlow:
    'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff9a3c]/70 to-transparent dark:via-[#3de8ff]/60',
  cardHover:
    'hover:border-[#ff9a3c]/45 hover:shadow-[0_0_28px_rgba(255,154,60,0.18)] dark:hover:border-[#3de8ff]/35 dark:hover:shadow-[0_0_28px_rgba(61,232,255,0.14)]',
  categoryPill:
    'rounded-full border border-[#ff9a3c]/30 bg-[#ff9a3c]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#ffc8a0] dark:border-[#3de8ff]/30 dark:bg-[#3de8ff]/10 dark:text-[#3de8ff]',
  listRow:
    'group relative border border-transparent hover:border-[#ff9a3c]/20 hover:bg-[#ff9a3c]/5 dark:hover:border-[#3de8ff]/[0.15] dark:hover:bg-[#3de8ff]/5',
  listAccent:
    'absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-gradient-to-b from-[#ff9a3c] to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-[#3de8ff]',
  divider: 'border-[#ff9a3c]/[0.12] dark:border-[#3de8ff]/10',

  /* ── Misc ── */
  iconBtn: 'text-[#ffe8d0]/85 hover:bg-[#ff9a3c]/10 hover:text-[#ffc8a0] dark:text-[#c8e8ff]/85 dark:hover:bg-[#3de8ff]/10 dark:hover:text-white',
  dropdownItem: 'text-[#ffe8d0] hover:bg-[#ff9a3c]/10 dark:text-[#c8e8ff] dark:hover:bg-[#3de8ff]/[0.08]',
  overlay: 'bg-[#1a0f2e]/70 dark:bg-black/65',
  searchIcon:
    'text-[#ffc8a0] hover:bg-[#ff9a3c]/[0.15] hover:text-[#ffe8d0] dark:text-[#c8e8ff] dark:hover:bg-[#3de8ff]/10 dark:hover:text-white',
  searchPanel:
    'border border-[#ff9a3c]/20 bg-[#1c0e38]/95 backdrop-blur-xl dark:border-[#3de8ff]/[0.15] dark:bg-[#070414]/95',
  postSection:
    'md:border md:border-[#ff9a3c]/20 md:bg-gradient-to-br md:from-[#2a1545]/90 md:via-[#1c0e38]/85 md:to-[#12082a]/80 md:shadow-[0_0_32px_rgba(255,154,60,0.1)] dark:md:border-[#3de8ff]/[0.15] dark:md:from-[#0a0618]/90 dark:md:via-[#070414]/90 dark:md:to-[#000008]/85 dark:md:shadow-[0_0_32px_rgba(61,232,255,0.08)]',

  /* ── Post detail / Comments ── */
  tagPill:
    'rounded-full border border-[#ff9a3c]/30 bg-[#ff9a3c]/10 px-3 py-1 text-xs text-[#ffc8a0] dark:border-[#3de8ff]/25 dark:bg-[#3de8ff]/[0.08] dark:text-[#3de8ff]',
  summaryBox:
    'rounded-lg border border-[#ff9a3c]/25 bg-gradient-to-r from-[#ff9a3c]/[0.08] to-[#8a4a68]/10 p-4 dark:border-[#3de8ff]/20 dark:from-[#3de8ff]/[0.06] dark:to-[#6366f1]/[0.08]',
  commentSection:
    'relative mt-10 max-w-4xl rounded-2xl px-4 py-8 sm:px-6 md:border md:px-8 md:backdrop-blur-sm md:overflow-hidden md:border-[#ff9a3c]/20 md:bg-gradient-to-br md:from-[#2a1545]/90 md:via-[#1c0e38]/85 md:to-[#12082a]/80 md:shadow-[0_0_32px_rgba(255,154,60,0.08)] dark:md:border-[#3de8ff]/[0.15] dark:md:from-[#0a0618]/90 dark:md:via-[#070414]/90 dark:md:to-[#000008]/85 dark:md:shadow-[0_0_32px_rgba(61,232,255,0.08)]',
  commentCard:
    'relative rounded-xl border border-[#ff9a3c]/20 bg-gradient-to-br from-[#2a1545]/70 to-[#1c0e38]/60 p-4 dark:border-[#3de8ff]/[0.15] dark:from-[#0a0618]/80 dark:to-[#070414]/60',
  commentReplyCard:
    'relative rounded-lg border border-[#ff9a3c]/[0.15] bg-gradient-to-br from-[#2a1545]/50 to-[#1c0e38]/40 p-3 dark:border-[#3de8ff]/[0.12] dark:from-[#070414]/70 dark:to-[#0a0618]/50',
  commentInput:
    'w-full resize-none rounded-lg border border-[#ff9a3c]/30 bg-[#2a1545]/80 p-3 font-mono text-[#ffe8d0] focus:outline-none focus:ring-2 focus:ring-[#ff9a3c]/40 dark:border-[#3de8ff]/25 dark:bg-[#070414]/80 dark:text-[#c8e8ff] dark:focus:ring-[#3de8ff]/35',
  commentLink:
    'text-xs text-[#ffb870] hover:text-[#ffc8a0] hover:underline dark:text-[#3de8ff] dark:hover:text-[#7ec8ff]',
  commentReplyBorder: 'border-l-2 border-[#ff9a3c]/20 pl-4 dark:border-[#3de8ff]/[0.15]',
} as const;
