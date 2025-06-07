import { SpaceBackground } from '@/widgets/post/ui';
import dynamic from 'next/dynamic';

const BlogHeader = dynamic(() => import('@/widgets/post/ui/BlogHeader'));
const Sidebar = dynamic(() => import('@/widgets/post/ui/Sidebar'));

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex flex-col items-center row-start-2 gap-8 sm:items-start bg-white min-h-screen'>
      <div className='w-full h-screen overflow-hidden bg-gradient-to-b from-[#181c2a] via-[#232946] to-[#23234d] text-slate-100 font-mono relative'>
        <SpaceBackground />

        <div className='flex h-screen'>
          {/* Main Content (왼쪽) */}
          <main className='flex-1 h-screen overflow-y-auto p-4 lg:p-10 flex justify-center'>
            <div className='w-full lg:w-[800px]'>
              <BlogHeader />
              {children}
            </div>
          </main>

          {/* 데스크톱 사이드바 */}
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
