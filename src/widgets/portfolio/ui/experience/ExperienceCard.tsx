import { motion } from 'framer-motion';
import { EXPERIENCE_ANIMATION_DURATION } from '@/entities/portfolio/model/constants';
import type { Experience } from '@/entities/portfolio/model/types';
import { overlayStyles } from '../overlayStyles';

const cardVariants = {
  hidden: {
    opacity: 0,
    x: -320,
    transition: { duration: EXPERIENCE_ANIMATION_DURATION.card, ease: 'easeOut' },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: EXPERIENCE_ANIMATION_DURATION.card, ease: 'easeOut' },
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
      className={`relative px-4 py-4 ${isSelected ? overlayStyles.panelSelected : overlayStyles.panel} flex flex-col items-start cursor-pointer transition-all duration-300`}
      style={{ clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)' }}
      onClick={() => onSelect(experience.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(experience.id);
        }
      }}
      tabIndex={0}
      aria-label={`${experience.company} experience card`}
    >
      <span className={`${overlayStyles.kicker} mb-1.5`}>{experience.id}</span>
      <span className={`${overlayStyles.title} text-base`}>{experience.company}</span>
      <span className='text-[#eeebe7]/85 text-xs font-mono mt-1.5'>{experience.role}</span>
      <div className={`flex flex-col gap-0.5 w-full mt-3 ${overlayStyles.subtitle}`}>
        <span>{experience.period}</span>
        <span>{experience.location}</span>
      </div>

      <motion.div
        className={`absolute left-0 bottom-0 h-[2px] ${overlayStyles.accentLine}`}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.28 }}
        style={{ zIndex: 2 }}
      />
    </motion.div>
  );
};
