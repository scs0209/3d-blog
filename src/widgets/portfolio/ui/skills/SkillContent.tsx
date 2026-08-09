import { motion } from 'framer-motion';
import type { SkillItem } from '../../consts';
import { skillItemVariants } from '../../lib/animations';
import { overlayStyles } from '../overlayStyles';

export const SkillContent = ({ skill }: { skill: SkillItem }) => {
  const IconComponent = skill.icon;

  return (
    <motion.div
      className='flex flex-col items-center group cursor-pointer'
      variants={skillItemVariants}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`${overlayStyles.iconBox} mb-1`}>
        <IconComponent className='w-6 h-6' style={{ color: skill.color || '#E5D6C4' }} />
      </div>
      <span className='text-[10px] text-[#E5D6C4]/80 group-hover:text-[#E5D6C4] transition-colors duration-300 text-center leading-tight font-mono'>
        {skill.name}
      </span>
    </motion.div>
  );
};
