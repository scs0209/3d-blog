import { motion } from 'framer-motion';
import { skillItemVariants } from '../../lib/animations';
import type { SkillItem } from '../../consts';

export const SkillContent = ({ skill }: { skill: SkillItem }) => {
  const IconComponent = skill.icon;

  return (
    <motion.div
      className='flex flex-col items-center group cursor-pointer'
      variants={skillItemVariants}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className='w-12 h-12 rounded-lg bg-gray-800/50 border border-[#E5D6C4]/20 flex items-center justify-center mb-1 group-hover:border-[#E5D6C4]/60 group-hover:bg-gray-700/50 transition-all duration-300'>
        <IconComponent className='w-6 h-6' style={{ color: skill.color || '#E5D6C4' }} />
      </div>
      <span className='text-[10px] text-[#E5D6C4]/80 group-hover:text-[#E5D6C4] transition-colors duration-300 text-center leading-tight'>
        {skill.name}
      </span>
    </motion.div>
  );
};
