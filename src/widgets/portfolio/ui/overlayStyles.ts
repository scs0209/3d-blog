/**
 * 포트폴리오 오버레이 공통 HUD 스타일
 * 색상 토큰: tailwind `neon.cream` / `neon.muted` / `neon.soft`
 */
export const OVERLAY_CREAM = '#E5D6C4'; // neon-cream
export const OVERLAY_CREAM_MUTED = '#eeebe7'; // neon-muted

export const overlayStyles = {
  panel: 'bg-black/55 backdrop-blur-md border border-neon-cream/20',
  panelSelected:
    'bg-black/65 backdrop-blur-md border border-neon-cream/55 shadow-[0_0_16px_rgba(229,214,196,0.12)]',
  title: 'text-neon-cream font-mono font-bold tracking-wider',
  subtitle: 'text-neon-muted/65 font-mono text-xs tracking-wide',
  body: 'text-neon-muted/90 font-mono text-sm leading-relaxed',
  accentLine: 'bg-neon-cream/80',
  chip: 'px-2.5 py-1 bg-black/50 border border-neon-cream/25 text-neon-cream/90 text-xs font-mono',
  button:
    'px-4 py-2.5 bg-black/60 backdrop-blur-sm text-neon-cream border border-neon-cream/45 font-mono text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-neon-cream/10 hover:border-neon-cream hover:text-neon-soft active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cream focus-visible:outline-offset-2',
  buttonPrimary:
    'relative px-6 py-3.5 bg-black/60 backdrop-blur-md text-neon-cream border border-neon-cream/50 font-mono text-sm font-bold tracking-widest cursor-pointer transition-all duration-200 hover:bg-neon-cream/10 hover:border-neon-cream active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cream focus-visible:outline-offset-2',
  input:
    'w-full bg-black/45 border border-neon-cream/30 px-4 py-2.5 text-neon-muted font-mono text-sm placeholder:text-neon-cream/35 focus:outline-none focus:border-neon-cream/65 focus:ring-1 focus:ring-neon-cream/25 transition',
  iconBox:
    'w-11 h-11 bg-black/45 border border-neon-cream/25 flex items-center justify-center group-hover:border-neon-cream/55 group-hover:bg-black/60 transition-all duration-300',
  kicker: 'text-[10px] font-mono tracking-[0.2em] text-neon-cream/50 uppercase',
} as const;
