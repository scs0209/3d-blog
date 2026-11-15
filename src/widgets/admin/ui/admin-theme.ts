/**
 * 관리자 화면 테마. 포트폴리오·블로그와 같은 어두운 바탕과 강조색 하나를 쓴다.
 * 유리 효과·빛 번짐·그라데이션·가는 테두리 없이, 옅은 면과 여백으로 구획을 나눈다.
 */
const SYNE = 'font-[family-name:var(--font-syne),sans-serif]';
const FIELD =
  'border-transparent bg-white/[0.06] text-white placeholder:text-[#8d98a3] focus-visible:border-[#4de3ff] focus-visible:ring-0';

export const adminTheme = {
  shell: 'relative min-h-screen overflow-hidden bg-[#050608] text-[#e9edf1]',
  orbA: 'hidden',
  orbB: 'hidden',
  orbC: 'hidden',
  stage: 'relative z-10 flex h-svh flex-col gap-4 p-4 md:p-5',
  stageRow: 'flex min-h-0 flex-1 items-stretch gap-4',
  window: 'relative flex min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl bg-[#0b0e12]',
  windowSheen: 'hidden',
  ornament: 'hidden h-fit shrink-0 flex-col items-center gap-2 self-center rounded-2xl bg-[#0b0e12] p-2 md:flex',
  ornamentBtn:
    'flex h-11 w-11 items-center justify-center rounded-xl text-[#8d98a3] transition-colors hover:bg-white/[0.07] hover:text-white',
  ornamentBtnActive: 'bg-white/[0.1] text-white',
  dock: 'mx-auto flex w-fit max-w-full items-center gap-1 rounded-full bg-[#0d1116] px-2 py-1.5',
  dockBtn:
    'flex items-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-medium text-[#c3ccd4] transition-colors hover:bg-white/[0.07] hover:text-white',
  navCol: 'flex h-full w-[15.5rem] shrink-0 flex-col bg-[#090b0f] px-4 py-6',
  navBrand: `mb-8 px-2 ${SYNE} text-[1.5rem] font-bold text-[#e9edf1]`,
  sectionLabel: 'text-[13px] font-medium text-[#8d98a3]',
  navBase:
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#c3ccd4] transition-colors hover:bg-white/[0.06] hover:text-white',
  navActive: 'bg-white/[0.09] text-white',
  headerTitle: `${SYNE} text-[1.6rem] font-semibold text-[#e9edf1]`,
  headerTrigger:
    'flex h-10 w-10 items-center justify-center rounded-full text-[#c3ccd4] transition-colors hover:bg-white/[0.08] hover:text-white md:hidden',
  profilePill:
    'inline-flex h-10 items-center justify-center rounded-full bg-white/[0.07] px-2.5 text-[#c3ccd4] transition-colors hover:bg-white/[0.12] hover:text-white',
  textPrimary: 'text-[#e9edf1]',
  textMuted: 'text-[#8d98a3]',
  textAccent: 'text-[#4de3ff]',
  navIdle: 'bg-white/[0.06] text-[#c3ccd4] transition-colors hover:bg-white/[0.1]',
  navCta: 'bg-white font-semibold text-[#050608] hover:bg-[#4de3ff]',
  card: 'relative gap-3 overflow-hidden rounded-xl border-0 bg-white/[0.045] py-4 shadow-none',
  cardTopGlow: 'hidden',
  pill: 'inline-flex items-center gap-1 rounded-md bg-white/[0.07] px-2 py-0.5 text-xs font-medium text-[#c3ccd4]',
  tableWrap: 'mx-6 overflow-hidden rounded-xl bg-white/[0.03]',
  surface: 'rounded-xl bg-white/[0.045]',
  input: `h-11 ${FIELD}`,
  titleInput: `h-auto border-0 bg-transparent px-0 py-3 ${SYNE} text-2xl font-semibold text-white shadow-none placeholder:text-[#8d98a3] focus-visible:ring-0`,
  selectTrigger: `h-9 w-full ${FIELD} data-[size=default]:h-9 hover:bg-white/[0.09]`,
  fieldBox:
    'flex h-9 w-full items-center gap-1.5 overflow-x-auto overflow-y-hidden whitespace-nowrap rounded-md bg-white/[0.06] px-2.5 text-white [scrollbar-width:thin]',
  selectContent: 'z-[100] overflow-hidden rounded-xl border-0 bg-[#12161c] text-white',
  editor: 'relative min-h-[420px] w-full overflow-hidden rounded-xl bg-white/[0.03]',
  primaryBtn: 'rounded-full border-0 bg-white px-6 font-semibold text-[#050608] shadow-none hover:bg-[#4de3ff]',
} as const;
