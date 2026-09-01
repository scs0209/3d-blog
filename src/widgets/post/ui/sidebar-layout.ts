/** Blog sidebar layout rhythm — shared nav grid tokens */
export const sidebarLayout = {
  section: 'flex flex-col gap-2',
  sectionHeader: 'mb-2 flex items-center gap-2 px-3',
  navList: 'flex flex-col gap-1 px-3',
  navRow: 'flex items-center gap-1',
  navToggle: 'inline-flex h-5 w-5 shrink-0 items-center justify-center',
  navButton: 'flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition',
  tags: 'flex flex-wrap gap-2 px-3',
} as const;

export const TREE_INDENT_PX = 12;
