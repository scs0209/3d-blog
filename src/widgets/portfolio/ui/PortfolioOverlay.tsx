'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphismCard, GlassmorphismButton } from '@/shared/ui/glassmorphism';
import { cardVariants, containerVariants } from '@/shared/animation';
import { portfolioProjects } from '../consts';
import { TitleBox } from './TitleBox';

export function PortfolioOverlay({ onRestart }: { onRestart: () => void }) {
  const [animationKey, setAnimationKey] = useState(0);

  const handleResetAnimation = () => {
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={`portfolio-${animationKey}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
        }}
        className='fixed inset-0 z-escape-hatch bg-black backdrop-blur-xl text-white font-mono overflow-auto'
      >
        {/* 애니메이션 재시작 버튼 */}
        <motion.div
          className='fixed top-6 right-6 z-10'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.3 }}
        >
          <GlassmorphismButton
            onClick={onRestart}
            variant='outline'
            size='sm'
            className='flex items-center gap-2 text-white border-white/30 hover:border-white/50 backdrop-blur-md'
          >
            <span className='animate-spin'>🔄</span>
            애니메이션 재시작
          </GlassmorphismButton>
        </motion.div>

        <TitleBox />

        <div className='min-h-screen p-4 flex items-center justify-center'>
          {/* 프로젝트 그리드 */}
          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            <AnimatePresence>
              {portfolioProjects.map((project, index) => (
                <motion.div key={`${project.id}-${animationKey}`} variants={cardVariants}>
                  <GlassmorphismCard className='overflow-hidden h-[520px] w-full'>
                    {/* 프로젝트 이미지 */}
                    <div className='h-48 bg-gradient-to-br from-white/3 to-white/8 flex items-center justify-center border-b border-white/15 overflow-hidden'>
                      <div className='text-center transform transition-transform duration-300 hover:scale-110'>
                        <div className='text-white text-6xl mb-4 transform transition-transform duration-500 hover:rotate-12'>
                          📁
                        </div>
                        <div className='text-white/70'>PROJECT {index + 1}</div>
                      </div>
                    </div>

                    {/* 프로젝트 정보 */}
                    <div className='p-6 relative h-full'>
                      <div className='h-[280px] overflow-hidden'>
                        <h3 className='text-xl font-bold text-white mb-2'>{project.title}</h3>
                        <p className='text-white/70 text-sm mb-4'>{project.subtitle}</p>
                        <p className='text-white/80 text-sm leading-relaxed overflow-hidden'>
                          <span className='line-clamp-6'>{project.description}</span>
                        </p>
                      </div>

                      <div className='absolute bottom-6 left-6 right-6 flex gap-4'>
                        <GlassmorphismButton variant='outline' size='sm' className='flex-1'>
                          VIEW LIVE
                        </GlassmorphismButton>
                        <GlassmorphismButton variant='primary' size='sm' className='flex-1'>
                          SOURCE CODE
                        </GlassmorphismButton>
                      </div>
                    </div>
                  </GlassmorphismCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
