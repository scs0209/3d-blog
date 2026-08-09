import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { EXPERIENCE_ANIMATION_DURATION } from '@/entities/portfolio/model/constants';
import type { AnimationPhase, Experience } from '@/entities/portfolio/model/types';
import { OverlayPanel } from '../OverlayShell';
import { overlayStyles } from '../overlayStyles';

interface ExperienceContentProps {
  experience: Experience | undefined;
  animPhase: AnimationPhase;
  onTopLineComplete: () => void;
  onContentExitComplete: () => void;
}

export const ExperienceContent = ({
  experience,
  animPhase,
  onTopLineComplete,
  onContentExitComplete,
}: ExperienceContentProps) => {
  const showTopLine = animPhase === 'cards-entered';
  const showContent = animPhase === 'active' || animPhase === 'content-exiting';
  const isContentExiting = animPhase === 'content-exiting';
  const isExitingRef = useRef(isContentExiting);

  useEffect(() => {
    isExitingRef.current = isContentExiting;
  }, [isContentExiting]);

  if (!experience) {
    return null;
  }

  return (
    <div className='flex flex-col w-full h-full min-h-0'>
      {showTopLine && (
        <motion.div
          className='w-full h-[2px] overflow-hidden flex-shrink-0'
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: EXPERIENCE_ANIMATION_DURATION.slide, ease: 'easeInOut' }}
          onAnimationComplete={onTopLineComplete}
        >
          <div className={`h-[2px] ${overlayStyles.accentLine} w-full`} />
        </motion.div>
      )}

      {showContent && (
        <div className='relative w-full flex-1 min-h-0'>
          <motion.div
            className='absolute inset-x-0 top-0 w-full overflow-hidden'
            initial={{ height: 0 }}
            animate={{
              height: isContentExiting ? 0 : '100%',
            }}
            transition={{
              height: { duration: EXPERIENCE_ANIMATION_DURATION.drop, ease: 'easeInOut' },
            }}
            onAnimationComplete={() => {
              if (isExitingRef.current) {
                onContentExitComplete();
              }
            }}
          >
            <div className='relative h-full w-full'>
              <OverlayPanel className='h-full w-full' contentClassName='h-full overflow-y-auto'>
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className='space-y-3 p-6 md:p-8'>
                    <p className={overlayStyles.kicker}>DETAILS</p>
                    {experience.description.map((desc) => (
                      <p key={desc.substring(0, 50)} className={overlayStyles.body}>
                        {desc}
                      </p>
                    ))}
                  </div>

                  <div className='px-6 md:px-8 pb-6 md:pb-8'>
                    <h3 className={`${overlayStyles.kicker} mb-3`}>TECHNOLOGIES</h3>
                    <div className='flex flex-wrap gap-2'>
                      {experience.skills.map((skill) => (
                        <span key={skill} className={overlayStyles.chip}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </OverlayPanel>

              {/* 하단 보더 — 접힐 때 패널 하단과 함께 위로 이동 */}
              <div className={`pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] ${overlayStyles.accentLine}`} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
