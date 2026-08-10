'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cardVariants, containerVariants } from '@/shared/animation';
import { portfolioProjects } from '../consts';
import { OverlayPanel } from './OverlayShell';
import { overlayStyles } from './overlayStyles';

export function PortfolioOverlay({ isExiting, onExitComplete }: { isExiting?: boolean; onExitComplete?: () => void }) {
  const [animationKey] = useState(0);
  const [isScaleExiting, setIsScaleExiting] = useState(false);
  const [cardExitComplete, setCardExitComplete] = useState(false);

  useEffect(() => {
    if (isExiting && cardExitComplete) {
      setIsScaleExiting(true);
    }
  }, [isExiting, cardExitComplete]);

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={`portfolio-${animationKey}`}
        initial={{ scale: 0 }}
        animate={{ scale: isScaleExiting ? 0 : 1 }}
        exit={{ scale: 0 }}
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
        }}
        onAnimationComplete={() => {
          if (isScaleExiting && onExitComplete) {
            onExitComplete();
          }
        }}
        className='fixed inset-0 z-overlay bg-[#0a0c10]/92 backdrop-blur-xl overflow-auto'
      >
        <div className='min-h-screen p-6 md:p-10 flex flex-col items-center justify-center'>
          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl w-full mx-auto'
            variants={containerVariants}
            initial='hidden'
            animate={isExiting ? 'exit' : 'visible'}
            exit='exit'
            onAnimationComplete={(definition) => {
              if (definition === 'exit' && isExiting) {
                setCardExitComplete(true);
              }
            }}
          >
            <AnimatePresence>
              {portfolioProjects.map((project, index) => (
                <motion.div key={`${project.id}-${animationKey}`} variants={cardVariants}>
                  <OverlayPanel
                    className='overflow-hidden h-[480px] w-full'
                    contentClassName='flex h-full flex-col'
                  >
                    <div className='h-40 shrink-0 border-b border-neon-cream/20 flex items-center justify-center bg-black/40'>
                      <div className='text-center'>
                        <p className={`${overlayStyles.kicker} mb-2`}>PROJECT {String(index + 1).padStart(2, '0')}</p>
                        <p className={`${overlayStyles.title} text-sm`}>{project.title}</p>
                      </div>
                    </div>

                    <div className='p-5 flex flex-1 min-h-0 flex-col'>
                      <p className={`${overlayStyles.subtitle} mb-3 shrink-0`}>{project.subtitle}</p>
                      <p className={`${overlayStyles.body} flex-1 min-h-0 overflow-y-auto`}>{project.description}</p>

                      {(project.liveUrl || project.sourceUrl) && (
                        <div className='mt-auto flex gap-3 pt-4 shrink-0'>
                          {project.liveUrl ? (
                            <a
                              href={project.liveUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className={`${overlayStyles.button} flex-1 text-center text-xs`}
                            >
                              VIEW LIVE
                            </a>
                          ) : null}
                          {project.sourceUrl ? (
                            <a
                              href={project.sourceUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className={`${overlayStyles.button} flex-1 text-center text-xs`}
                            >
                              SOURCE
                            </a>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </OverlayPanel>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
