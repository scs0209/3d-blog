import { useState } from 'react';
import { experiences } from '@/entities/portfolio/model/constants';
import { useExperienceAnimation } from '@/features/portfolio/hooks/use-experience-animation';
import { ExperienceCard } from './ExperienceCard';
import { ExperienceContent } from './ExperienceContent';

interface ExperiencePageProps {
  isClosing?: boolean;
  onClose?: () => void;
}

export const ExperiencePage = ({ isClosing = false, onClose }: ExperiencePageProps) => {
  const [selectedExpId, setSelectedExpId] = useState<string>('XP_03');

  const { animState, handleCardAnimationComplete, handleTopLineComplete, handleContentExitComplete } =
    useExperienceAnimation(isClosing, onClose);

  const selectedExperience = experiences.find((exp) => exp.id === selectedExpId);

  return (
    <div className='fixed top-14 left-0 h-screen w-screen backdrop-blur-[2px] bg-transparent'>
      <div
        className='fixed pl-4 mt-16 h-screen w-full flex flex-row gap-6'
        style={{
          top: '48px',
          maxHeight: 'calc(-128px - 8rem + 100vh)',
        }}
      >
        {/* 왼쪽: 경험 카드들 */}
        <div className='relative w-[280px] flex-shrink-0'>
          <div className='absolute w-full flex flex-col gap-4'>
            {experiences.map((exp, index) => {
              const shouldShow = index <= animState.currentCardIndex;

              return (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  isSelected={selectedExpId === exp.id}
                  shouldShow={shouldShow}
                  onSelect={setSelectedExpId}
                  onAnimationComplete={() => handleCardAnimationComplete(index)}
                />
              );
            })}
          </div>
        </div>

        {/* 오른쪽: 선택된 경험 상세 내용 */}
        <div className='flex-1 min-w-0 overflow-y-auto pr-6'>
          <ExperienceContent
            experience={selectedExperience}
            animPhase={animState.phase}
            onTopLineComplete={handleTopLineComplete}
            onContentExitComplete={handleContentExitComplete}
          />
        </div>
      </div>
    </div>
  );
};
