'use client';

import { Folder, Hash } from 'lucide-react';
import { CategoryModal } from '@/widgets/category';
import { CreateTagModal } from '@/widgets/tag';
import { adminTheme } from './admin-theme';

export const AdminDock = () => {
  return (
    <div className={adminTheme.dock} role='toolbar' aria-label='빠른 작업'>
      <CategoryModal
        trigger={
          <button type='button' className={adminTheme.dockBtn} aria-label='카테고리 추가'>
            <Folder className='h-4 w-4' strokeWidth={1.75} aria-hidden />
            카테고리
          </button>
        }
      />
      <CreateTagModal
        trigger={
          <button type='button' className={adminTheme.dockBtn} aria-label='태그 추가'>
            <Hash className='h-4 w-4' strokeWidth={1.75} aria-hidden />
            태그
          </button>
        }
      />
      <span className='mx-1 h-5 w-px bg-white/15' aria-hidden />
      <div className='flex items-center gap-2 px-3 py-2.5'>
        <span className='h-2 w-2 rounded-full bg-[#1ed760] shadow-[0_0_8px_rgba(30,215,96,0.7)]' />
        <span className='text-sm text-white/60'>운영 중</span>
      </div>
    </div>
  );
};
