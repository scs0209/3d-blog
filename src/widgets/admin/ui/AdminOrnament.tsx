'use client';

import { Folder, Home, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AdminNavLink } from './AdminNavLink';
import { adminTheme } from './admin-theme';

const items = [
  { href: '/admin', label: '대시보드', icon: Home, exact: true },
  { href: '/admin/post', label: '새 글 작성', icon: Plus, exact: true },
  { href: '/admin/categories', label: '카테고리', icon: Folder, exact: false },
] as const;

export const AdminOrnament = () => {
  const pathname = usePathname();

  return (
    <nav className={adminTheme.ornament} aria-label='바로가기'>
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <AdminNavLink key={item.href} href={item.href} label={item.label} icon={item.icon} active={active} iconOnly />
        );
      })}
    </nav>
  );
};
