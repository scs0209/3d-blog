'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shadcn-ui/components/ui/sidebar';
import { cn } from '@/shadcn-ui/lib/utils';
import { Tooltip } from '@/shared/ui/Tooltip';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';
import { CategoryModal } from '@/widgets/category';
import { CreateTagModal } from '@/widgets/tag';
import { Folder, Hash, Home, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: '대시보드', icon: Home, exact: true },
  { href: '/admin/post', label: '새 글 작성', icon: Plus, exact: true, cta: true },
  { href: '/admin/categories', label: '카테고리', icon: Folder, exact: false },
] as const;

const AuthSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <Sidebar collapsible='offcanvas' variant='floating' className='h-full'>
      <div className={adminTheme.sidebarGlass}>
        <SidebarHeader className='border-b border-[#ff9a3c]/15 p-4 dark:border-[#3de8ff]/15'>
          <div className='flex items-center gap-3'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#ff9a3c]/40 bg-gradient-to-br from-[#ff9a3c]/40 to-[#8a4a68]/50 text-base font-bold text-[#ffe8d0] shadow-[0_0_16px_rgba(255,154,60,0.25)] dark:border-[#3de8ff]/40 dark:from-[#3de8ff]/30 dark:to-[#6366f1]/40 dark:text-[#c8e8ff] dark:shadow-[0_0_16px_rgba(61,232,255,0.2)]'>
              B
            </div>
            <div className='min-w-0'>
              <h2 className={`truncate text-base font-bold ${adminTheme.textPrimary}`}>3D Blog</h2>
              <p className={`text-xs ${adminTheme.textMuted}`}>관리자</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className='flex flex-col p-3'>
          <SidebarGroup>
            <SidebarMenu className='gap-1.5 space-y-0'>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                const cta = 'cta' in item && item.cta;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        'h-auto rounded-xl px-0 py-0 text-sm',
                        cta ? adminTheme.navCta : adminTheme.navBase,
                        !cta && active && adminTheme.navActive,
                      )}
                    >
                      <Link
                        href={item.href}
                        className='flex w-full items-center gap-2.5 px-3 py-2.5'
                        aria-current={active ? 'page' : undefined}
                      >
                        <Icon
                          className={cn('h-4 w-4 shrink-0', active || cta ? adminTheme.textAccent : adminTheme.textMuted)}
                        />
                        <span
                          className={cn(
                            'text-sm font-medium',
                            active || cta ? adminTheme.textPrimary : adminTheme.textMuted,
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>

          <div className='flex-1' />

          <SidebarGroup className='mt-auto'>
            <div className='mb-2 px-1'>
              <h3 className={adminTheme.sectionLabel}>빠른 작업</h3>
            </div>
            <div className='flex justify-start gap-2 px-1'>
              <div className='relative'>
                <Tooltip content='카테고리 관리' position='top' neonIntensity='low' neon={true}>
                  <div className={adminTheme.quickAction}>
                    <Folder className={`h-4 w-4 ${adminTheme.textMuted}`} />
                  </div>
                </Tooltip>
                <div className='absolute inset-0 z-[51]'>
                  <CategoryModal />
                </div>
              </div>

              <div className='relative'>
                <Tooltip content='태그 추가' position='top' neonIntensity='low' neon={true}>
                  <div className={adminTheme.quickAction}>
                    <Hash className={`h-4 w-4 ${adminTheme.textMuted}`} />
                  </div>
                </Tooltip>
                <div className='absolute inset-0 z-[51]'>
                  <CreateTagModal />
                </div>
              </div>
            </div>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className='border-t border-[#ff9a3c]/15 p-3 dark:border-[#3de8ff]/15'>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-[#ff9a3c] shadow-[0_0_8px_rgba(255,154,60,0.7)] dark:bg-[#3de8ff] dark:shadow-[0_0_8px_rgba(61,232,255,0.6)]' />
            <span className={`text-xs ${adminTheme.textMuted}`}>운영 중</span>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
};

export default AuthSidebar;
