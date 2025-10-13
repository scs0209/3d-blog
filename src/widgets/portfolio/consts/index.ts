export const SECONDARY_ANIMATION_TARGETS = [
  'work',
  'home',
  'radar',
  'resumeConsole',
  'skill',
  'server',
  'experience',
] as const;

export const titleMap: Record<string, { title: string; subtitle: string }> = {
  work: { title: 'ABOUT ME', subtitle: 'Personal Information' },
  home: { title: 'HOME', subtitle: 'Welcome Back' },
  server: { title: 'WORKS', subtitle: 'Portfolio Projects' },
  resumeConsole: { title: 'RESUME', subtitle: 'Professional Experience' },
  experience: { title: 'EXPERIENCE', subtitle: 'Work History' },
  skill: { title: 'SKILLS', subtitle: 'Technical Expertise' },
  platform: { title: 'PLAYGROUND', subtitle: 'Creative Space' },
  holoTable: { title: 'PLAYGROUND', subtitle: 'Creative Space' },
  radar: { title: 'CONTACT ME', subtitle: 'Get In Touch' },
};

export * from './portfolioProject';
export * from './skillSections';
export * from './aboutMeData';
export * from './aboutMeAnimationConfig';
