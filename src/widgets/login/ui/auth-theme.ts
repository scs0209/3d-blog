import { blogTheme } from '@/widgets/post/ui/blog-theme';

/** 로그인·회원가입 — blogTheme 기반 */
export const authTheme = {
  shell: blogTheme.shell,
  shellRoot: blogTheme.shellRoot,
  bottomVeil: blogTheme.bottomVeil,
  titleGradient: blogTheme.titleGradient,
  textPrimary: blogTheme.textPrimary,
  textMuted: blogTheme.textMuted,
  textAccent: blogTheme.textAccent,
  card: `${blogTheme.card} ${blogTheme.cardHover} relative overflow-hidden rounded-2xl`,
  cardGlow: blogTheme.cardTopGlow,
  label: `mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] ${blogTheme.labelAccent}`,
  input:
    'w-full rounded-lg border border-[#ff9a3c]/25 bg-[#2a1545]/50 px-4 py-2.5 text-sm text-[#ffe8d0] placeholder:text-[#d4a8c0]/40 backdrop-blur-sm transition focus:border-[#ff9a3c]/55 focus:outline-none focus:ring-2 focus:ring-[#ff9a3c]/25 dark:border-[#3de8ff]/20 dark:bg-[#070414]/60 dark:text-[#c8e8ff] dark:placeholder:text-[#7ec8ff]/35 dark:focus:border-[#3de8ff]/45 dark:focus:ring-[#3de8ff]/20',
  submitBtn:
    'w-full rounded-lg border border-[#ff9a3c]/40 bg-gradient-to-r from-[#ff9a3c]/90 via-[#e878a0]/80 to-[#c44d2a]/90 px-4 py-2.5 text-sm font-semibold tracking-wide text-white shadow-[0_0_20px_rgba(255,154,60,0.25)] transition hover:scale-[1.01] hover:shadow-[0_0_28px_rgba(255,154,60,0.35)] focus:outline-none focus:ring-2 focus:ring-[#ff9a3c]/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#3de8ff]/35 dark:from-[#3de8ff]/80 dark:via-[#6366f1]/70 dark:to-[#312e81]/90 dark:shadow-[0_0_20px_rgba(61,232,255,0.2)] dark:hover:shadow-[0_0_28px_rgba(61,232,255,0.3)] dark:focus:ring-[#3de8ff]/35',
  linkBtn: `font-medium ${blogTheme.textAccent} underline-offset-4 transition hover:underline`,
  error: 'mt-1 text-sm text-red-400',
  rootError: 'mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-300',
  footer: `text-center text-sm ${blogTheme.textMuted}`,
  backBtn: `inline-flex items-center gap-1.5 rounded-lg border border-[#ff9a3c]/25 bg-[#2a1545]/40 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#ffc8a0] transition hover:border-[#ff9a3c]/45 hover:bg-[#3d1f5c]/50 dark:border-[#3de8ff]/20 dark:bg-black/30 dark:text-[#3de8ff] dark:hover:border-[#3de8ff]/40 dark:hover:bg-black/50`,
} as const;
