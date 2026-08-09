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
  const [selectedExpId, setSelectedExpId] = useState<string>(experiences[0]?.id ?? '');

  const { animState, handleCardAnimationComplete, handleTopLineComplete, handleContentExitComplete } =
    useExperienceAnimation(isClosing, onClose);

  const selectedExperience = experiences.find((exp) => exp.id === selectedExpId);

  return (
    <div className='flex flex-row gap-6 h-full min-h-0 flex-1 overflow-hidden w-full'>
      <div className='relative w-[280px] flex-shrink-0 h-full overflow-y-auto'>
        <div className='flex flex-col gap-4'>
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

      <div className='flex-1 min-w-0 min-h-0 h-full flex flex-col'>
        <ExperienceContent
          experience={selectedExperience}
          animPhase={animState.phase}
          onTopLineComplete={handleTopLineComplete}
          onContentExitComplete={handleContentExitComplete}
        />
      </div>
    </div>
  );
};
