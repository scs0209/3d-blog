'use client';

import { motion } from 'framer-motion';
import { gridVariants } from '../../lib/animations';
import { skillSections } from '../../consts/skillSections';
import { SkillCard } from './SkillCard';

interface SkillsOverlayProps {
  skillsClosing: boolean;
  onAnimationComplete: () => void;
}

export function SkillsOverlay({ skillsClosing, onAnimationComplete }: SkillsOverlayProps) {
  const handleAnimationComplete = () => {
    if (skillsClosing) {
      onAnimationComplete();
    }
  };

  return (
    <motion.div
      className='text-white font-mono h-full'
      initial={{ opacity: 0, x: '100%' }}
      animate={{
        opacity: skillsClosing ? 0 : 1,
        x: skillsClosing ? '100%' : 0,
      }}
      transition={{
        duration: 0.6,
        ease: 'easeInOut',
        delay: skillsClosing ? 2.0 : 0,
      }}
      onAnimationComplete={handleAnimationComplete}
    >
      <div className='h-full p-6 flex flex-col justify-center'>
        {/* 스킬 섹션들 */}
        <motion.div
          className='w-full grid grid-cols-1 xl:grid-cols-2 gap-4 mb-8 overflow-y-auto'
          variants={gridVariants}
          initial='hidden'
          animate={skillsClosing ? 'hidden' : 'show'}
        >
          {skillSections.map((section) => (
            <SkillCard key={section.title} section={section} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
