import type { JSX } from 'react';

export function AboutFooter({ socials }: { socials: { type: string; url: string }[] }) {
  const icons: Record<string, JSX.Element> = {
    github: (
      <svg width='24' height='24' fill='none' stroke='#00fff7' strokeWidth='2' viewBox='0 0 24 24' aria-label='GitHub'>
        <title>GitHub</title>
        <path d='M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.73 0 .27.16.58.67.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z' />
      </svg>
    ),
    linkedin: (
      <svg
        width='24'
        height='24'
        fill='none'
        stroke='#00fff7'
        strokeWidth='2'
        viewBox='0 0 24 24'
        aria-label='LinkedIn'
      >
        <title>LinkedIn</title>
        <path d='M16 8a6 6 0 0 1 6 6v5h-4v-5a2 2 0 0 0-4 0v5h-4v-9h4v1.5' />
        <rect x='2' y='9' width='4' height='12' />
        <circle cx='4' cy='4' r='2' />
      </svg>
    ),
    email: (
      <svg width='24' height='24' fill='none' stroke='#00fff7' strokeWidth='2' viewBox='0 0 24 24' aria-label='Email'>
        <title>Email</title>
        <rect x='2' y='4' width='20' height='16' rx='2' />
        <path d='m22 6-10 7L2 6' />
      </svg>
    ),
  };
  return (
    <div className='flex gap-6 mt-6'>
      {socials.map((s) => (
        <a
          key={s.type}
          href={s.url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 text-cyan-300 hover:text-cyan-100 neon-glow transition'
        >
          {icons[s.type] || null}
          <span className='font-mono text-sm'>{s.type.toUpperCase()}</span>
        </a>
      ))}
    </div>
  );
}
