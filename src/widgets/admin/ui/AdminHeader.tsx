'use client';

import { usePathname } from 'next/navigation';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';

const TITLE_MAP: { match: (path: string) => boolean; title: string }[] = [
  { match: (p) => p === '/admin', title: '대시보드' },
  { match: (p) => p === '/admin/post', title: '새 글 작성' },
  { match: (p) => p.startsWith('/admin/post/'), title: '글 수정' },
  { match: (p) => p.startsWith('/admin/categories'), title: '카테고리' },
  { match: (p) => p.startsWith('/admin/tags'), title: '태그' },
  { match: (p) => p.startsWith('/admin/users'), title: '사용자' },
];

export const AdminHeaderTitle = () => {
  const pathname = usePathname();
  const title = TITLE_MAP.find((item) => item.match(pathname))?.title ?? '관리자 대시보드';

  return <h1 className={adminTheme.headerTitle}>{title}</h1>;
};
