/** 관리자 폼·에디터 전용 토큰 (blog accent 미사용) */
export const adminFormTheme = {
  accentDot: 'h-1.5 w-1.5 rounded-full bg-white/70',
  selectItem:
    'rounded-md text-sm focus:bg-white/12 focus:text-white data-[highlighted]:bg-white/12 data-[highlighted]:text-white',
  focusRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35',
  divider: 'border-t border-white/10 pt-4',
  skeletonPulse: 'animate-pulse rounded-lg bg-white/10',
  progressBar:
    'h-full w-1/3 animate-[admin-nav-progress_1.1s_ease-in-out_infinite] bg-gradient-to-r from-white/15 via-white/45 to-white/15 shadow-[0_0_12px_rgba(255,255,255,0.2)]',
  editorRoot:
    'relative w-full min-h-[420px] cursor-text rounded-xl border border-white/15 bg-white/[0.06] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md',
  editorBody:
    'admin-prose flex min-h-[380px] w-full flex-1 flex-col [&_.ProseMirror]:min-h-[380px] [&_.ProseMirror]:w-full [&_.ProseMirror]:flex-1 [&_.ProseMirror]:cursor-text [&_.ProseMirror]:text-white/90 [&_.ProseMirror_h1]:text-white [&_.ProseMirror_h2]:text-white [&_.ProseMirror_h3]:text-white [&_.ProseMirror_a]:text-white/75 [&_.ProseMirror_a:hover]:text-white [&_.ProseMirror_blockquote]:border-white/25 [&_.ProseMirror_blockquote]:bg-white/[0.04] [&_.ProseMirror_blockquote]:text-white/75 [&_.ProseMirror_code]:bg-white/10 [&_.ProseMirror_code]:text-white/85 [&_.ProseMirror_pre]:border-white/12 [&_.ProseMirror_pre]:bg-black/30 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-white/35',
  editorProse:
    'prose prose-invert max-w-full font-default focus:outline-none prose-headings:font-title prose-headings:text-white prose-p:my-3 prose-p:text-white/90',
  editorCommand:
    'z-50 h-auto max-h-[330px] overflow-y-auto rounded-xl border border-white/15 bg-[#1c1828]/95 px-1 py-2 text-white shadow-[0_0_24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all',
  editorCommandItem:
    'command-item flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-white/12',
  editorCommandIcon:
    'flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/8',
  editorCommandMuted: 'text-xs text-white/55',
} as const;
