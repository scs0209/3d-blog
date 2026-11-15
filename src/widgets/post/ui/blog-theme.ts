/**
 * 블로그 테마. 포트폴리오와 같은 어두운 바탕과 강조색 하나를 쓴다.
 * 구획은 가는 선이나 테두리 상자가 아니라 여백과 옅은 면으로 나눈다.
 * 라벨은 띄어 쓴 대문자 대신 평범한 작은 글씨로 쓴다.
 * 빛 번짐·유리 효과·그라데이션은 쓰지 않는다. 밝은 테마와 어두운 테마는 같은 모습이다.
 */
const INK = 'text-[#e9edf1]';
const BODY = 'text-[#c3ccd4]';
const DIM = 'text-[#8d98a3]';
const ACCENT = 'text-[#4de3ff]';
const RULE = 'border-transparent';
const SURFACE = 'bg-white/[0.045]';
const MONO = 'font-mono text-[12px]';
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4de3ff]';

export const blogTheme = {
  /* ── Shell ── */
  shell: 'bg-[#050608] text-[#c3ccd4]',
  shellRoot: 'min-h-screen bg-[#050608]',
  bottomVeil: 'hidden',

  /* ── Chrome ── */
  chromeBar: 'bg-transparent',
  chromeShine: 'hidden',
  navBtn: `rounded-md ${SURFACE} ${BODY} transition-colors hover:bg-white/[0.09] hover:text-white ${FOCUS}`,
  dropdown: 'rounded-lg bg-[#10141a]',
  sidebar: 'bg-[#090b0f]',

  /* ── Typography ── */
  titleGradient: INK,
  sectionTitle: `${MONO} ${DIM}`,
  sectionLine: 'hidden',
  sectionLineReverse: 'hidden',
  labelAccent: ACCENT,
  textPrimary: INK,
  textMuted: DIM,
  textAccent: ACCENT,
  mono: MONO,
  body: BODY,
  focus: FOCUS,

  /* ── Nav ── */
  navActive: 'rounded-md bg-white/[0.09] text-white',
  navIdle: `rounded-md ${BODY} hover:bg-white/[0.05] hover:text-white`,

  /* ── Cards ── */
  card: `rounded-lg ${SURFACE}`,
  cardTopGlow: 'hidden',
  cardHover: 'hover:bg-white/[0.08]',
  categoryPill: `${MONO} ${ACCENT}`,
  listRow: 'group relative',
  listAccent: 'hidden',
  divider: RULE,

  /* ── Misc ── */
  iconBtn: `${BODY} hover:bg-white/[0.06] hover:text-white ${FOCUS}`,
  dropdownItem: `${BODY} hover:bg-white/[0.06] hover:text-white`,
  overlay: 'bg-black/70',
  searchIcon: `${BODY} hover:bg-white/[0.06] hover:text-white ${FOCUS}`,
  searchPanel: 'rounded-lg bg-[#10141a]',
  postSection: '',

  /* ── Post detail / Comments ── */
  tagPill: `rounded-md ${SURFACE} px-2.5 py-1 text-[13px] ${BODY}`,
  summaryBox: `rounded-lg ${SURFACE} p-5`,
  commentSection: 'relative mt-20 max-w-3xl',
  commentCard: `relative rounded-lg ${SURFACE} p-4`,
  commentReplyCard: 'relative bg-white/[0.03] p-3',
  commentInput: `w-full resize-none rounded-lg ${SURFACE} p-3 text-sm leading-relaxed text-[#e9edf1] placeholder:text-[#8d98a3] focus:bg-white/[0.07] focus:outline-none`,
  commentLink: 'text-xs text-[#4de3ff] hover:text-white hover:underline',
  commentReplyBorder: 'pl-4',
} as const;
