'use client';

import { aboutMeData } from '../../consts';
import { SectionTab } from './SectionTab';
import { ContentArea } from './ContentArea';

interface AboutMePageProps {
  isClosing?: boolean;
  onClose?: () => void;
}

export function AboutMePage({ isClosing = false, onClose }: AboutMePageProps) {
  const sectionCount = aboutMeData.sections.length;

  return (
    <div
      className='fixed top-0 left-0 h-screen w-screen backdrop-blur-[2px] bg-transparent'
      style={{
        maxWidth: 'calc(4rem + 50vw)',
        maskImage: 'linear-gradient(to right, white 50%, transparent 100%)',
        opacity: 1,
      }}
    >
      <div
        className='fixed pl-4 mt-16 h-screen max-w-[50vw] flex flex-col gap-4 overflow-y-hidden'
        style={{
          top: '48px',
          maxHeight: 'calc(-128px - 8rem + 100vh)',
        }}
      >
        {/* 섹션 네온 탭 */}
        <div className='flex gap-4 ml-4'>
          {aboutMeData.sections.map((section, i) => (
            <SectionTab
              key={section.key}
              section={section}
              sectionIndex={i}
              sectionCount={sectionCount}
              isClosing={isClosing}
            />
          ))}
        </div>

        {/* 본문 영역 */}
        <ContentArea sectionCount={sectionCount} isClosing={isClosing} onClose={onClose} />
      </div>
    </div>
  );
}
