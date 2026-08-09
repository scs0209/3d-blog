import { motion } from 'framer-motion';
import type { SkillSection } from '../../consts';
import { cardVariants, skillGridVariants } from '../../lib/animations';
import { OverlayPanel } from '../OverlayShell';
import { overlayStyles } from '../overlayStyles';
import { SkillContent } from './SkillContent';

export const SkillCard = ({ section }: { section: SkillSection }) => {
  return (
    <motion.div variants={cardVariants}>
      <OverlayPanel className='p-4'>
        <div className='mb-3 pb-2 border-b border-[#E5D6C4]/20'>
          <h2 className={`${overlayStyles.title} text-sm`}>{section.title}</h2>
        </div>

        <motion.div className='grid grid-cols-4 sm:grid-cols-5 gap-2' variants={skillGridVariants}>
          {section.items.map((skill) => (
            <SkillContent key={skill.name} skill={skill} />
          ))}
        </motion.div>
      </OverlayPanel>
    </motion.div>
  );
};
