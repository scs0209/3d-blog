'use client';

import { motion } from 'framer-motion';

import { GlassmorphismCard } from '@/shared/ui/glassmorphism';

interface SkillsOverlayProps {
  skillsClosing: boolean;
  onAnimationComplete: () => void;
}

// 스킬 데이터 구조
interface SkillItem {
  name: string;
  icon: string; // 아이콘 이모지 또는 텍스트
  color?: string;
}

interface SkillSection {
  title: string;
  items: SkillItem[];
}

const skillSections: SkillSection[] = [
  {
    title: 'LANGUAGES',
    items: [
      { name: 'HTML5', icon: '🌐', color: '#E34F26' },
      { name: 'CSS3', icon: '🎨', color: '#1572B6' },
      { name: 'JavaScript', icon: 'JS', color: '#F7DF1E' },
      { name: 'TypeScript', icon: 'TS', color: '#3178C6' },
      { name: 'Liquid', icon: '💧', color: '#7AB55C' },
    ],
  },
  {
    title: 'DATABASES',
    items: [
      { name: 'Hasura', icon: '⚡', color: '#1EB4D4' },
      { name: 'Firebase', icon: '🔥', color: '#FFCA28' },
      { name: 'MySQL', icon: '🐬', color: '#4479A1' },
      { name: 'CleverCloud', icon: '☁️', color: '#F39C12' },
      { name: 'Meteor', icon: '☄️', color: '#DE4F4F' },
    ],
  },
  {
    title: 'FRAMEWORKS',
    items: [
      { name: 'Next.js', icon: 'N', color: '#000000' },
      { name: 'React', icon: '⚛️', color: '#61DAFB' },
      { name: 'Express', icon: 'EX', color: '#000000' },
      { name: 'Django', icon: '🎯', color: '#092E20' },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { name: 'AWS', icon: '☁️', color: '#FF9900' },
      { name: 'Git', icon: '🔀', color: '#F05032' },
      { name: 'Prisma', icon: '🔺', color: '#2D3748' },
      { name: 'Xcode', icon: '📱', color: '#1575F9' },
      { name: 'Figma', icon: '🎨', color: '#F24E1E' },
    ],
  },
  {
    title: 'APIS',
    items: [
      { name: 'Shopify', icon: '🛍️', color: '#7AB55C' },
      { name: 'Stripe', icon: '💳', color: '#635BFF' },
      { name: 'Klayvio', icon: '📧', color: '#FF6900' },
      { name: 'Notion', icon: '📝', color: '#000000' },
      { name: 'Facebook', icon: '📘', color: '#1877F2' },
      { name: 'TikTok', icon: '🎵', color: '#FF0050' },
      { name: 'Analytics', icon: '📊', color: '#E37400' },
      { name: 'Discord', icon: '🎮', color: '#5865F2' },
      { name: 'Adobe', icon: '🎨', color: '#FF0000' },
      { name: 'Velo', icon: '⚡', color: '#0C6EFC' },
    ],
  },
];

export function SkillsOverlay({ skillsClosing, onAnimationComplete }: SkillsOverlayProps) {
  return (
    <motion.div
      className='text-white font-mono h-full'
      initial={{ opacity: 0, x: '100%' }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{
        duration: 0.6,
        ease: 'easeInOut',
      }}
      onAnimationComplete={onAnimationComplete}
    >
      <div className='h-full p-6 flex flex-col justify-center'>
        {/* 스킬 섹션들 */}
        <motion.div
          className='w-full grid grid-cols-1 xl:grid-cols-2 gap-4 mb-8 overflow-y-auto'
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial='hidden'
          animate='show'
        >
          {skillSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                show: {
                  opacity: skillsClosing ? 0 : 1,
                  y: skillsClosing ? -30 : 0,
                  scale: skillsClosing ? 0.9 : 1,
                },
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <GlassmorphismCard className='p-4'>
                {/* 섹션 제목 */}
                <div className='text-center mb-4'>
                  <h2 className='text-lg font-bold text-[#E5D6C4] tracking-wider border-b border-[#E5D6C4]/30 pb-2'>
                    {section.title}
                  </h2>
                </div>

                {/* 스킬 아이템들 */}
                <div className='grid grid-cols-5 gap-2'>
                  {section.items.map((skill, itemIndex) => (
                    <motion.div
                      key={skill.name}
                      className='flex flex-col items-center group cursor-pointer'
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: sectionIndex * 0.1 + itemIndex * 0.05,
                        duration: 0.4,
                        type: 'spring',
                        stiffness: 300,
                      }}
                    >
                      {/* 아이콘 컨테이너 */}
                      <div className='w-12 h-12 rounded-lg bg-gray-800/50 border border-[#E5D6C4]/20 flex items-center justify-center mb-1 group-hover:border-[#E5D6C4]/60 group-hover:bg-gray-700/50 transition-all duration-300'>
                        {skill.icon.length <= 2 ? (
                          <span className='text-sm font-bold' style={{ color: skill.color || '#E5D6C4' }}>
                            {skill.icon}
                          </span>
                        ) : (
                          <span className='text-lg'>{skill.icon}</span>
                        )}
                      </div>

                      {/* 스킬 이름 */}
                      <span className='text-[10px] text-[#E5D6C4]/80 group-hover:text-[#E5D6C4] transition-colors duration-300 text-center leading-tight'>
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphismCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
