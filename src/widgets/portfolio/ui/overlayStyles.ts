/**
 * 포트폴리오 오버레이 공통 HUD 스타일
 * OverlayManager(브랜드/EXIT)와 동일한 cream + dark glass 톤
 */
export const OVERLAY_CREAM = '#E5D6C4';
export const OVERLAY_CREAM_MUTED = '#eeebe7';

export const overlayStyles = {
  panel: 'bg-black/55 backdrop-blur-md border border-[#E5D6C4]/20',
  panelSelected: 'bg-black/65 backdrop-blur-md border border-[#E5D6C4]/55 shadow-[0_0_16px_rgba(229,214,196,0.12)]',
  title: 'text-[#E5D6C4] font-mono font-bold tracking-wider',
  subtitle: 'text-[#eeebe7]/65 font-mono text-xs tracking-wide',
  body: 'text-[#eeebe7]/90 font-mono text-sm leading-relaxed',
  accentLine: 'bg-[#E5D6C4]/80',
  chip: 'px-2.5 py-1 bg-black/50 border border-[#E5D6C4]/25 text-[#E5D6C4]/90 text-xs font-mono',
  button:
    'px-4 py-2.5 bg-black/60 backdrop-blur-sm text-[#E5D6C4] border border-[#E5D6C4]/45 font-mono text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-[#E5D6C4]/10 hover:border-[#E5D6C4] hover:text-[#f3efeb] active:scale-95',
  buttonPrimary:
    'relative px-6 py-3.5 bg-black/60 backdrop-blur-md text-[#E5D6C4] border border-[#E5D6C4]/50 font-mono text-sm font-bold tracking-widest cursor-pointer transition-all duration-200 hover:bg-[#E5D6C4]/10 hover:border-[#E5D6C4] active:scale-95',
  input:
    'w-full bg-black/45 border border-[#E5D6C4]/30 px-4 py-2.5 text-[#eeebe7] font-mono text-sm placeholder:text-[#E5D6C4]/35 focus:outline-none focus:border-[#E5D6C4]/65 focus:ring-1 focus:ring-[#E5D6C4]/25 transition',
  iconBox:
    'w-11 h-11 bg-black/45 border border-[#E5D6C4]/25 flex items-center justify-center group-hover:border-[#E5D6C4]/55 group-hover:bg-black/60 transition-all duration-300',
  kicker: 'text-[10px] font-mono tracking-[0.2em] text-[#E5D6C4]/50 uppercase',
} as const;
