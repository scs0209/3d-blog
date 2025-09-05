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
import { CategoryModal } from '@/widgets/category';
import { CreateTagModal } from '@/widgets/tag';
import { Plus, FileText, Tag, Home, Settings, Folder, Hash } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Tooltip } from './Tooltip';

// 스타일 객체들 분리
const styles = {
  sidebarContainer: {
    className:
      'h-full w-full bg-gradient-to-br from-white/15 via-white/8 to-white/3 backdrop-blur-xl border border-white/40 shadow-lg shadow-white/20 rounded-lg flex flex-col',
    style: {
      boxShadow:
        '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    },
  },
  menuButton: {
    base: 'relative rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-xl bg-gradient-to-br from-white/8 to-white/4 border border-white/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-white/15 hover:to-white/8',
    dashboard: 'hover:border-blue-400/50',
    posts: 'hover:border-green-400/50',
    tags: 'hover:border-yellow-400/50',
    newPost:
      'bg-gradient-to-br from-purple-500/80 to-blue-500/70 border border-purple-400/50 hover:bg-gradient-to-br hover:from-purple-500/90 hover:to-blue-500/80 hover:border-purple-400/70',
  },
  quickAction:
    'w-10 h-10 rounded-xl bg-gradient-to-br from-white/8 to-white/4 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-white/12 hover:to-white/6 hover:border-white/30 flex items-center justify-center cursor-pointer active:scale-95',
} as const;

const boxShadows = {
  dashboard: '0 0 10px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  posts: '0 0 10px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  tags: '0 0 10px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  newPost: '0 0 15px rgba(139, 69, 255, 0.4), 0 0 30px rgba(139, 69, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  quickAction:
    'inset 2px 2px 6px rgba(0, 0, 0, 0.3), inset -2px -2px 6px rgba(255, 255, 255, 0.1), 0 0 8px rgba(255, 255, 255, 0.1)',
  quickActionHover:
    'inset 3px 3px 8px rgba(0, 0, 0, 0.4), inset -3px -3px 8px rgba(255, 255, 255, 0.15), 0 0 12px rgba(255, 255, 255, 0.2)',
  quickActionActive:
    'inset 4px 4px 10px rgba(0, 0, 0, 0.5), inset -2px -2px 6px rgba(255, 255, 255, 0.05), 0 0 6px rgba(255, 255, 255, 0.1)',
} as const;

const AuthSidebar = () => {
  const [categoryHover, setCategoryHover] = useState(false);
  const [categoryActive, setCategoryActive] = useState(false);
  const [tagHover, setTagHover] = useState(false);
  const [tagActive, setTagActive] = useState(false);

  const getCategoryBoxShadow = () => {
    if (categoryActive) return boxShadows.quickActionActive;
    if (categoryHover) return boxShadows.quickActionHover;
    return boxShadows.quickAction;
  };

  const getTagBoxShadow = () => {
    if (tagActive) return boxShadows.quickActionActive;
    if (tagHover) return boxShadows.quickActionHover;
    return boxShadows.quickAction;
  };

  return (
    <Sidebar collapsible='offcanvas' variant='floating' className='h-full'>
      <div className={styles.sidebarContainer.className} style={styles.sidebarContainer.style}>
        {/* Header */}
        <SidebarHeader className='p-6 border-b border-white/10'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25'>
              <span className='text-white font-bold text-lg'>B</span>
            </div>
            <div>
              <h2 className='text-lg font-bold text-white/95'>Blog Dashboard</h2>
            </div>
          </div>
        </SidebarHeader>

        {/* Main Navigation */}
        <SidebarContent className='p-4 flex flex-col'>
          <SidebarGroup>
            <SidebarMenu className='space-y-2'>
              {/* Dashboard Home */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`${styles.menuButton.base} ${styles.menuButton.dashboard}`}
                  style={{ boxShadow: boxShadows.dashboard }}
                >
                  <Link href='/admin' className='flex items-center gap-3 p-3'>
                    <Home className='w-5 h-5 text-blue-400' />
                    <span className='text-white/90 font-medium'>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Create New Post */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`${styles.menuButton.base} ${styles.menuButton.newPost}`}
                  style={{ boxShadow: boxShadows.newPost }}
                >
                  <Link href='/admin/post' className='flex items-center gap-3 p-3'>
                    <Plus className='w-5 h-5 text-white' />
                    <span className='text-white font-medium'>New Post</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Posts Management */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`${styles.menuButton.base} ${styles.menuButton.posts}`}
                  style={{ boxShadow: boxShadows.posts }}
                >
                  <Link href='/admin' className='flex items-center gap-3 p-3'>
                    <FileText className='w-5 h-5 text-green-400' />
                    <span className='text-white/90 font-medium'>All Posts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Tags Management */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`${styles.menuButton.base} ${styles.menuButton.tags}`}
                  style={{ boxShadow: boxShadows.tags }}
                >
                  <Link href='/admin/tags' className='flex items-center gap-3 p-3'>
                    <Tag className='w-5 h-5 text-yellow-400' />
                    <span className='text-white/90 font-medium'>Tags</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* Spacer to push Quick Actions to bottom */}
          <div className='flex-1' />

          {/* Quick Actions Section - Moved to bottom */}
          <SidebarGroup className='mt-auto'>
            <div className='px-3 mb-3'>
              <h3 className='text-xs font-semibold text-white/50 uppercase tracking-wider'>Quick Actions</h3>
            </div>
            <div className='flex gap-3 justify-center'>
              {/* Category Modal Icon */}
              <div
                className='relative'
                onMouseEnter={() => setCategoryHover(true)}
                onMouseLeave={() => setCategoryHover(false)}
                onMouseDown={() => setCategoryActive(true)}
                onMouseUp={() => setCategoryActive(false)}
              >
                <Tooltip content='카테고리 관리' position='top' neonIntensity='low' neon={true}>
                  <div className={styles.quickAction} style={{ boxShadow: getCategoryBoxShadow() }}>
                    <Folder className='w-5 h-5 text-white/70 hover:text-white/90 transition-colors' />
                  </div>
                </Tooltip>
                <div className='absolute inset-0 pointer-events-auto z-10'>
                  <CategoryModal />
                </div>
              </div>

              {/* Tag Modal Icon */}
              <div
                className='relative'
                onMouseEnter={() => setTagHover(true)}
                onMouseLeave={() => setTagHover(false)}
                onMouseDown={() => setTagActive(true)}
                onMouseUp={() => setTagActive(false)}
              >
                <Tooltip content='태그 관리' position='top' neonIntensity='low' neon={true}>
                  <div className={styles.quickAction} style={{ boxShadow: getTagBoxShadow() }}>
                    <Hash className='w-5 h-5 text-white/70 hover:text-white/90 transition-colors' />
                  </div>
                </Tooltip>
                <div className='absolute inset-0 pointer-events-auto z-10'>
                  <CreateTagModal />
                </div>
              </div>
            </div>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className='p-4 border-t border-white/10'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse' />
              <span className='text-white/60 text-xs'>System Online</span>
            </div>
            <button type='button' className='text-white/40 hover:text-white/70 transition-colors'>
              <Settings className='w-4 h-4' />
            </button>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
};
export default AuthSidebar;
