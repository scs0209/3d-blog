import type React from 'react';

interface BlogContentProps {
  title: string;
  children: React.ReactNode;
}

export const BlogContent = ({ title, children }: BlogContentProps) => {
  return (
    <div className='w-[668px] h-[432px] bg-[#F5F5F7] rounded-2xl shadow-2xl border border-[#E0E0E0] overflow-hidden flex flex-col'>
      {/* 맥 창 상단 바 */}
      <div className='flex items-center h-9 px-4 bg-[#EDEDED] border-b border-[#E0E0E0]'>
        {/* 컬러 버튼 */}
        <div className='flex items-center gap-2 mr-4'>
          <span className='w-3 h-3 rounded-full bg-[#FF605C] border border-[#e0e0e0]' />
          <span className='w-3 h-3 rounded-full bg-[#FFBD44] border border-[#e0e0e0]' />
          <span className='w-3 h-3 rounded-full bg-[#00CA4E] border border-[#e0e0e0]' />
        </div>
        <span className='text-xs text-[#888] font-medium truncate'>{title}</span>
      </div>
      {/* 내용 영역 */}
      <div className='flex-1 overflow-y-auto p-6 text-[#222] text-base leading-relaxed scrollbar-thin scrollbar-thumb-[#E0E0E0] scrollbar-track-[#F5F5F7]'>
        {children}
      </div>
    </div>
  );
};

export default BlogContent;
