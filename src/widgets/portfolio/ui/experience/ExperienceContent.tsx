import { motion } from 'framer-motion';
import type { Experience, AnimationPhase } from '@/entities/portfolio/model/types';
import { EXPERIENCE_ANIMATION_DURATION } from '@/entities/portfolio/model/constants';

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
  const showBottomLine = animPhase === 'content-exiting';
  const isContentExiting = animPhase === 'content-exiting';

  if (!experience) {
    return null;
  }

  return (
    <>
      {/* 상단 라인 - 카드 입장 완료 후 표시 */}
      {showTopLine && (
        <motion.div
          className='w-full h-[3px] overflow-hidden'
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: EXPERIENCE_ANIMATION_DURATION.slide, ease: 'easeInOut' }}
          onAnimationComplete={onTopLineComplete}
        >
          <div className='h-[3px] bg-white/80 rounded-t w-full' />
        </motion.div>
      )}

      {/* 콘텐츠 박스 */}
      {showContent && (
        <div
          className='w-full bg-white/10 backdrop-blur-md border border-white/60'
          style={{ borderBottom: '2px solid rgba(255,255,255,0.6)' }}
        >
          <motion.div
            key={`content-${experience.id}`}
            className='w-full flex flex-col gap-4 overflow-hidden'
            initial={{ height: isContentExiting ? 'auto' : 0, opacity: isContentExiting ? 1 : 0 }}
            animate={{ height: isContentExiting ? 0 : 'auto', opacity: isContentExiting ? 0 : 1 }}
            transition={{
              height: { duration: EXPERIENCE_ANIMATION_DURATION.drop, ease: 'easeInOut' },
              opacity: { duration: 0.3, delay: isContentExiting ? 0 : EXPERIENCE_ANIMATION_DURATION.drop * 0.5 },
            }}
            onAnimationComplete={isContentExiting ? onContentExitComplete : undefined}
          >
            {/* 설명 */}
            <div className='space-y-4 p-6'>
              {experience.description.map((desc) => (
                <p key={desc.substring(0, 50)} className='text-white/90 text-base font-mono leading-relaxed'>
                  {desc}
                </p>
              ))}
            </div>

            {/* 기술 스택 */}
            <div className='mt-6 p-6'>
              <h3 className='text-white font-bold mb-3'>TECHNOLOGIES</h3>
              <div className='flex flex-wrap gap-2'>
                {experience.skills.map((skill) => (
                  <span
                    key={skill}
                    className='px-3 py-1 bg-white/10 border border-white/60 rounded-full text-white/90 text-sm font-mono backdrop-blur-sm'
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 하단 라인 - 콘텐츠 닫힐 때 축소 */}
      {showBottomLine && (
        <motion.div
          className='w-full h-[3px] overflow-hidden'
          initial={{ width: '100%' }}
          animate={{ width: 0 }}
          transition={{
            duration: EXPERIENCE_ANIMATION_DURATION.slide,
            delay: EXPERIENCE_ANIMATION_DURATION.drop,
            ease: 'easeInOut',
          }}
        >
          <div className='h-[3px] bg-white/80 rounded-t w-full' />
        </motion.div>
      )}
    </>
  );
};
