/** BlogLandingScene 3D 진입 — Glass Orbit cosmos 팔레트 */
export const blogLandingTheme = {
  shell:
    'fixed inset-0 z-10 h-full w-full overflow-hidden bg-gradient-to-b from-[#2a1545] via-[#1c0e38] to-[#12082a] dark:from-[#000008] dark:via-[#070414] dark:to-[#0a0618]',
  canvasBg: '#12082a',
  canvasBgDark: '#070414',
  floor: '#1a0f2e',
  scrollHint: 'mb-2 text-xs text-[#f5f0e8]/75 sm:text-sm dark:text-[#e8eef5]/75',
  scrollTrack: 'relative mx-auto h-10 w-6 rounded-full border-2 border-[#ff9a3c]/45 dark:border-[#3de8ff]/40',
  scrollThumb: 'mx-auto mt-2 h-3 w-1 rounded-full bg-[#ff9a3c] dark:bg-[#3de8ff]',
  accentLight: '#ff9a3c',
  accentDark: '#3de8ff',
} as const;
