/** 관리자 UI — 원본 floating glass 레이아웃용 코스모스 토큰 */
export const adminTheme = {
  shell:
    'relative min-h-screen bg-gradient-to-br from-[#2a1545] via-[#1c0e38] to-[#12082a] text-[#ffe8d0] dark:from-[#000008] dark:via-[#070414] dark:to-[#0a0618] dark:text-[#c8e8ff]',
  orbA: 'absolute right-0 top-0 h-72 w-72 rounded-full bg-[#ff9a3c]/20 blur-3xl dark:bg-[#3de8ff]/15',
  orbB: 'absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#8a4a68]/20 blur-3xl dark:bg-[#6366f1]/15',
  orbC: 'absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff9a3c]/10 blur-3xl dark:bg-[#3de8ff]/10',
  insetGlass:
    'absolute inset-0 h-full rounded-3xl border-l border-[#ff9a3c]/25 bg-gradient-to-br from-[#ffe8d0]/10 via-[#2a1545]/40 to-[#1c0e38]/50 backdrop-blur-xl dark:border-[#3de8ff]/20 dark:from-white/10 dark:via-[#070414]/50 dark:to-[#000008]/60',
  sidebarGlass:
    'flex h-full w-full flex-col rounded-lg border border-[#ff9a3c]/30 bg-gradient-to-br from-[#ffe8d0]/10 via-[#2a1545]/50 to-[#1c0e38]/60 shadow-[0_0_28px_rgba(255,154,60,0.12)] backdrop-blur-xl dark:border-[#3de8ff]/25 dark:from-white/10 dark:via-[#070414]/60 dark:to-[#000008]/70 dark:shadow-[0_0_28px_rgba(61,232,255,0.1)]',
  headerTrigger:
    'rounded-lg p-2 text-[#ffe8d0]/90 transition hover:bg-[#ff9a3c]/15 hover:text-[#ffe8d0] dark:text-[#c8e8ff]/90 dark:hover:bg-[#3de8ff]/15',
  headerTitle: 'text-2xl font-semibold text-[#ffe8d0] drop-shadow-lg dark:text-[#c8e8ff]',
  textPrimary: 'text-[#ffe8d0] dark:text-[#c8e8ff]',
  textMuted: 'text-[#d4a8c0]/85 dark:text-[#7ec8ff]/75',
  textAccent: 'text-[#ffb870] dark:text-[#3de8ff]',
  navBase:
    'relative rounded-xl border border-[#ff9a3c]/20 bg-gradient-to-br from-[#ffe8d0]/8 to-[#2a1545]/30 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff9a3c]/45 hover:from-[#ff9a3c]/15 dark:border-[#3de8ff]/20 dark:from-white/8 dark:to-[#070414]/40 dark:hover:border-[#3de8ff]/45 dark:hover:from-[#3de8ff]/12',
  navIdle:
    'border border-transparent text-[#ffe8d0]/85 transition hover:border-[#ff9a3c]/20 hover:bg-[#ff9a3c]/[0.08] dark:text-[#c8e8ff]/85 dark:hover:border-[#3de8ff]/20 dark:hover:bg-[#3de8ff]/[0.08]',
  navActive:
    'border-[#ff9a3c]/55 bg-[#ff9a3c]/15 text-[#ffc8a0] shadow-[0_0_16px_rgba(255,154,60,0.2)] dark:border-[#3de8ff]/50 dark:bg-[#3de8ff]/12 dark:text-[#3de8ff]',
  navCta:
    'border border-[#ff9a3c]/45 bg-gradient-to-br from-[#ff9a3c]/35 to-[#8a4a68]/40 text-[#ffe8d0] shadow-[0_0_18px_rgba(255,154,60,0.25)] hover:from-[#ff9a3c]/45 dark:border-[#3de8ff]/40 dark:from-[#3de8ff]/25 dark:to-[#6366f1]/30 dark:text-[#c8e8ff] dark:shadow-[0_0_18px_rgba(61,232,255,0.2)]',
  quickAction:
    'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#ff9a3c]/25 bg-gradient-to-br from-[#ffe8d0]/8 to-[#2a1545]/30 backdrop-blur-sm transition hover:scale-105 hover:border-[#ff9a3c]/45 dark:border-[#3de8ff]/25 dark:from-white/8 dark:to-[#070414]/40 dark:hover:border-[#3de8ff]/45',
  card:
    'relative gap-3 overflow-hidden rounded-2xl border border-[#ff9a3c]/25 bg-gradient-to-br from-[#2a1545]/80 via-[#1c0e38]/70 to-[#12082a]/80 py-4 shadow-[0_8px_32px_rgba(255,154,60,0.12)] backdrop-blur-md dark:border-[#3de8ff]/20 dark:from-[#0a0618]/85 dark:via-[#070414]/80 dark:to-[#000008]/85 dark:shadow-[0_8px_32px_rgba(61,232,255,0.1)]',
  cardTopGlow:
    'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff9a3c]/70 to-transparent dark:via-[#3de8ff]/60',
  pill:
    'inline-flex items-center gap-1 rounded-full border border-[#ff9a3c]/30 bg-[#ff9a3c]/10 px-2 py-0.5 text-xs font-medium text-[#ffc8a0] dark:border-[#3de8ff]/30 dark:bg-[#3de8ff]/10 dark:text-[#3de8ff]',
  tableWrap:
    'mx-6 overflow-hidden rounded-lg border border-[#ff9a3c]/20 bg-[#1c0e38]/45 dark:border-[#3de8ff]/[0.15] dark:bg-[#070414]/50',
  surface:
    'rounded-xl border border-[#ff9a3c]/20 bg-[#2a1545]/35 dark:border-[#3de8ff]/[0.15] dark:bg-[#0a0618]/45',
  sectionLabel: 'text-xs font-semibold uppercase tracking-[0.16em] text-[#ff9a3c] dark:text-[#3de8ff]',
  input:
    'h-11 border-[#ff9a3c]/25 bg-[#2a1545]/40 text-[#ffe8d0] placeholder:text-[#d4a8c0]/55 focus-visible:border-[#ff9a3c]/55 focus-visible:ring-[#ff9a3c]/25 dark:border-[#3de8ff]/20 dark:bg-[#0a0618]/50 dark:text-[#c8e8ff] dark:placeholder:text-[#7ec8ff]/45 dark:focus-visible:border-[#3de8ff]/45 dark:focus-visible:ring-[#3de8ff]/20',
  titleInput:
    'h-auto border-0 border-b border-[#ff9a3c]/20 bg-transparent px-0 py-3 text-2xl font-semibold text-[#ffe8d0] shadow-none placeholder:text-[#d4a8c0]/45 focus-visible:border-[#ff9a3c]/50 focus-visible:ring-0 dark:border-[#3de8ff]/20 dark:text-[#c8e8ff] dark:placeholder:text-[#7ec8ff]/40 dark:focus-visible:border-[#3de8ff]/45',
  selectTrigger:
    'h-9 w-full border-[#ff9a3c]/25 bg-[#2a1545]/40 text-[#ffe8d0] placeholder:text-[#d4a8c0]/55 data-[size=default]:h-9 focus-visible:border-[#ff9a3c]/55 focus-visible:ring-[#ff9a3c]/25 dark:border-[#3de8ff]/20 dark:bg-[#0a0618]/50 dark:text-[#c8e8ff] dark:placeholder:text-[#7ec8ff]/45 dark:focus-visible:border-[#3de8ff]/45 dark:focus-visible:ring-[#3de8ff]/20 hover:bg-[#ff9a3c]/10 dark:hover:bg-[#3de8ff]/10',
  fieldBox:
    'flex h-9 w-full items-center gap-1.5 overflow-x-auto overflow-y-hidden whitespace-nowrap rounded-md border border-[#ff9a3c]/25 bg-[#2a1545]/40 px-2.5 dark:border-[#3de8ff]/20 dark:bg-[#0a0618]/50 [scrollbar-width:thin]',
  selectContent:
    'z-[100] overflow-hidden rounded-xl border border-[#ff9a3c]/25 bg-gradient-to-br from-[#2a1545]/95 via-[#1c0e38]/95 to-[#12082a]/95 text-[#ffe8d0] shadow-[0_0_30px_rgba(255,154,60,0.15)] backdrop-blur-2xl dark:border-[#3de8ff]/20 dark:from-[#0a0618]/95 dark:via-[#070414]/95 dark:to-[#000008]/95 dark:text-[#c8e8ff] dark:shadow-[0_0_30px_rgba(61,232,255,0.12)]',
  editor:
    'relative w-full min-h-[420px] overflow-hidden rounded-xl border border-[#ff9a3c]/25 bg-[#1c0e38]/40 shadow-[inset_0_1px_0_rgba(255,154,60,0.08)] backdrop-blur-md dark:border-[#3de8ff]/20 dark:bg-[#070414]/50 dark:shadow-[inset_0_1px_0_rgba(61,232,255,0.08)]',
  primaryBtn:
    'border border-[#ff9a3c]/45 bg-gradient-to-br from-[#ff9a3c]/40 to-[#8a4a68]/45 text-[#ffe8d0] shadow-[0_0_18px_rgba(255,154,60,0.25)] hover:from-[#ff9a3c]/50 dark:border-[#3de8ff]/40 dark:from-[#3de8ff]/25 dark:to-[#6366f1]/35 dark:text-[#c8e8ff] dark:shadow-[0_0_18px_rgba(61,232,255,0.2)]',
} as const;
