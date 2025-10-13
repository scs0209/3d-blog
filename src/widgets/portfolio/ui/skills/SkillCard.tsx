import { GlassmorphismCard } from '@/shared/ui';
import { motion } from 'framer-motion';
import { cardVariants, skillGridVariants } from '../../lib/animations';
import type { SkillSection } from '../../consts';
import { SkillContent } from './SkillContent';

export const SkillCard = ({ section }: { section: SkillSection }) => {
  return (
    <motion.div variants={cardVariants}>
      <GlassmorphismCard className='p-4'>
        <div className='text-center mb-4'>
          <h2 className='text-lg font-bold text-[#E5D6C4] tracking-wider border-b border-[#E5D6C4]/30 pb-2'>
            {section.title}
          </h2>
        </div>

        <motion.div className='grid grid-cols-5 gap-2' variants={skillGridVariants}>
          {section.items.map((skill) => (
            <SkillContent key={skill.name} skill={skill} />
          ))}
        </motion.div>
      </GlassmorphismCard>
    </motion.div>
  );
};
