/** 로그인·회원가입 테마. 포트폴리오·블로그와 같은 어두운 바탕, 옅은 면, 강조색 하나 */
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4de3ff]';

export const authTheme = {
  shell: 'bg-[#050608] text-[#c3ccd4]',
  shellRoot: 'min-h-screen bg-[#050608]',
  bottomVeil: 'hidden',
  titleGradient: 'text-[#e9edf1]',
  textPrimary: 'text-[#e9edf1]',
  textMuted: 'text-[#8d98a3]',
  textAccent: 'text-[#4de3ff]',
  card: 'relative rounded-2xl bg-white/[0.045]',
  cardGlow: 'hidden',
  label: 'mb-1.5 block text-[13px] font-medium text-[#8d98a3]',
  input:
    'w-full rounded-lg border border-transparent bg-white/[0.06] px-4 py-2.5 text-sm text-[#e9edf1] placeholder:text-[#8d98a3]/70 transition-colors focus:border-[#4de3ff] focus:bg-white/[0.08] focus:outline-none',
  submitBtn: `w-full rounded-full bg-white px-4 py-3 text-[15px] font-semibold text-[#050608] transition-colors hover:bg-[#4de3ff] disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`,
  linkBtn: 'font-medium text-[#4de3ff] underline-offset-4 transition-colors hover:underline',
  error: 'mt-1 text-sm text-[#ff8a8a]',
  rootError: 'mb-4 rounded-lg bg-[#ff8a8a]/10 px-3 py-2 text-center text-sm text-[#ffb3b3]',
  footer: 'text-center text-sm text-[#8d98a3]',
  backBtn: `inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3.5 py-1.5 text-[13px] text-[#dfe5ea] transition-colors hover:bg-white/[0.14] hover:text-white ${FOCUS}`,
} as const;
