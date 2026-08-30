'use client';

import { Folder, Home, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AdminNavLink } from '@/widgets/admin/ui/AdminNavLink';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';

const navItems = [
  { href: '/admin', label: '대시보드', icon: Home, exact: true },
  { href: '/admin/post', label: '새 글 작성', icon: Plus, exact: true },
  { href: '/admin/categories', label: '카테고리', icon: Folder, exact: false },
] as const;

type AuthSidebarProps = {
  onNavigate?: () => void;
};

const AuthSidebar = ({ onNavigate }: AuthSidebarProps) => {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className={adminTheme.navCol} aria-label='관리 메뉴'>
      <p className={adminTheme.navBrand}>Discover</p>
      <p className={`${adminTheme.sectionLabel} mb-2 px-3`}>관리</p>
      <ul className='flex flex-col gap-0.5'>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <li key={item.href}>
              <AdminNavLink href={item.href} label={item.label} icon={item.icon} active={active} onClick={onNavigate} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AuthSidebar;
