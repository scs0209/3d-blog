'use client';

import { useState } from 'react';
import { aboutMeData } from '../../consts';
import { ContentArea } from './ContentArea';
import { SectionTab } from './SectionTab';

interface AboutMePageProps {
  isClosing?: boolean;
  onClose?: () => void;
}

export function AboutMePage({ isClosing = false, onClose }: AboutMePageProps) {
  const sectionCount = aboutMeData.sections.length;
  const [selectedSectionKey, setSelectedSectionKey] = useState(aboutMeData.sections[0]?.key ?? 'quick-bio');

  const selectedSection =
    aboutMeData.sections.find((section) => section.key === selectedSectionKey) ?? aboutMeData.sections[0];

  const handleSelectSection = (key: string) => {
    if (isClosing) {
      return;
    }
    setSelectedSectionKey(key);
  };

  return (
    <div className='flex flex-col gap-5 h-full max-h-full overflow-hidden'>
      <div className='flex flex-wrap gap-3'>
        {aboutMeData.sections.map((section, i) => (
          <SectionTab
            key={section.key}
            section={section}
            sectionIndex={i}
            sectionCount={sectionCount}
            isClosing={isClosing}
            isSelected={section.key === selectedSectionKey}
            onSelect={handleSelectSection}
          />
        ))}
      </div>

      <div className='flex-1 min-h-0 overflow-hidden'>
        <ContentArea
          section={selectedSection}
          sectionCount={sectionCount}
          isClosing={isClosing}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
