import { motion } from 'framer-motion';
import type { Experience } from '@/entities/portfolio/model/types';
import { EXPERIENCE_ANIMATION_DURATION } from '@/entities/portfolio/model/constants';

const cardVariants = {
  hidden: {
    opacity: 0,
    x: -320,
    transition: {
      duration: EXPERIENCE_ANIMATION_DURATION.card,
      ease: 'easeOut',
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: EXPERIENCE_ANIMATION_DURATION.card,
      ease: 'easeOut',
    },
  },
};

interface ExperienceCardProps {
  experience: Experience;
  isSelected: boolean;
  shouldShow: boolean;
  onSelect: (id: string) => void;
  onAnimationComplete: () => void;
}

export const ExperienceCard = ({
  experience,
  isSelected,
  shouldShow,
  onSelect,
  onAnimationComplete,
}: ExperienceCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      initial='hidden'
      animate={shouldShow ? 'visible' : 'hidden'}
      onAnimationComplete={onAnimationComplete}
      className={`relative px-6 py-5 bg-white/10 backdrop-blur-md text-white font-bold tracking-widest flex flex-col items-start justify-end cursor-pointer transition-all duration-300 border border-white/60 ${
        isSelected ? 'shadow-lg border-white/80' : 'shadow border-white/40'
      }`}
      style={{
        clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)',
        borderWidth: '1px',
      }}
      onClick={() => onSelect(experience.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(experience.id);
        }
      }}
      tabIndex={0}
      aria-label={`${experience.company} experience card`}
    >
      <span className='text-xs font-mono text-white/70 mb-2'>{experience.id}</span>
      <span className='text-white text-lg font-extrabold tracking-widest'>{experience.company}</span>
      <span className='text-white/90 text-sm font-mono mt-2'>{experience.role}</span>
      <div className='flex flex-col gap-1 w-full mt-4 text-xs font-mono text-white/70'>
        <span>{experience.period}</span>
        <span>{experience.location}</span>
      </div>

      {/* 하단 강조선 */}
      <motion.div
        className='absolute left-0 bottom-0 h-[2px] bg-white/80 rounded'
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.28 }}
        style={{ zIndex: 2 }}
      />
    </motion.div>
  );
};
