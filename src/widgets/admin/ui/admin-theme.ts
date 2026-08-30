/** 관리자 Spatial UI — visionOS 글래스 윈도우 + 오너먼트 */
export const adminTheme = {
  shell: 'relative min-h-screen overflow-hidden bg-[#1a1428] text-white dark:bg-[#0a0814]',
  orbA: 'pointer-events-none absolute -right-24 top-0 h-[28rem] w-[28rem] rounded-full bg-[#c4b5a5]/25 blur-[90px] dark:bg-[#3d4a6b]/30',
  orbB: 'pointer-events-none absolute -bottom-32 -left-16 h-[32rem] w-[32rem] rounded-full bg-[#8a7a92]/20 blur-[100px] dark:bg-[#1e1a3a]/40',
  orbC: 'pointer-events-none absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-white/10 blur-[80px] dark:bg-white/5',
  stage: 'relative z-10 flex h-svh flex-col gap-4 p-4 md:p-5',
  stageRow: 'flex min-h-0 flex-1 items-stretch gap-4',
  window:
    'relative flex min-h-0 min-w-0 flex-1 overflow-hidden rounded-[32px] border border-white/20 bg-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-[40px] backdrop-saturate-150 dark:border-white/12 dark:bg-white/[0.07]',
  windowSheen:
    'pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent',
  ornament:
    'hidden h-fit shrink-0 flex-col items-center gap-2 self-center rounded-[28px] border border-white/20 bg-white/12 p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[40px] backdrop-saturate-150 md:flex dark:border-white/12 dark:bg-white/[0.08]',
  ornamentBtn:
    'flex h-12 w-12 items-center justify-center rounded-[18px] text-white/70 transition hover:bg-white/15 hover:text-white',
  ornamentBtnActive: 'bg-white/22 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]',
  dock: 'mx-auto flex w-fit max-w-full items-center gap-1 rounded-full border border-white/20 bg-white/12 px-2 py-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-[40px] backdrop-saturate-150 dark:border-white/12 dark:bg-white/[0.08]',
  dockBtn:
    'flex items-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/12 hover:text-white',
  navCol: 'flex h-full w-[15.5rem] shrink-0 flex-col border-r border-white/10 px-4 py-6',
  navBrand: 'mb-8 px-2 text-[1.65rem] font-semibold tracking-tight text-white',
  sectionLabel: 'text-[13px] font-medium text-white/45',
  navBase:
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-white/70 transition hover:bg-white/10 hover:text-white',
  navActive: 'bg-white/16 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]',
  headerTitle: 'text-[1.65rem] font-semibold tracking-tight text-white',
  headerTrigger:
    'flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/12 hover:text-white md:hidden',
  profilePill:
    'inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/10 px-2.5 text-white/80 transition hover:bg-white/16 hover:text-white',
  textPrimary: 'text-white',
  textMuted: 'text-white/55',
  textAccent: 'text-white',
  navIdle: 'border border-white/15 bg-white/8 text-white/80 transition hover:bg-white/12',
  navCta: 'bg-[#1ed760] font-semibold text-black hover:bg-[#3be072]',
  card: 'relative gap-3 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] py-4 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-md',
  cardTopGlow:
    'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent',
  pill: 'inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-xs font-medium text-white/80',
  tableWrap: 'mx-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20',
  surface: 'rounded-2xl border border-white/10 bg-white/[0.06]',
  input:
    'h-11 border-white/15 bg-white/8 text-white placeholder:text-white/40 focus-visible:border-white/35 focus-visible:ring-white/20',
  titleInput:
    'h-auto border-0 border-b border-white/15 bg-transparent px-0 py-3 text-2xl font-semibold text-white shadow-none placeholder:text-white/35 focus-visible:border-white/40 focus-visible:ring-0',
  selectTrigger:
    'h-9 w-full border-white/15 bg-white/8 text-white placeholder:text-white/40 data-[size=default]:h-9 focus-visible:border-white/35 focus-visible:ring-white/20 hover:bg-white/12',
  fieldBox:
    'flex h-9 w-full items-center gap-1.5 overflow-x-auto overflow-y-hidden whitespace-nowrap rounded-md border border-white/15 bg-white/8 px-2.5 text-white [scrollbar-width:thin]',
  selectContent:
    'z-[100] overflow-hidden rounded-xl border border-white/15 bg-[#1c1828]/92 text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl',
  editor:
    'relative min-h-[420px] w-full overflow-hidden rounded-xl border border-white/12 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md',
  primaryBtn:
    'rounded-full border-0 bg-[#1ed760] px-6 font-semibold text-black shadow-[0_8px_24px_rgba(30,215,96,0.28)] hover:bg-[#3be072]',
} as const;
