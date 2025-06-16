import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AboutMePage({ isClosing = false, onClose }: { isClosing?: boolean; onClose?: () => void }) {
  const [slideDone, setSlideDone] = useState(false);

  const aboutMeData = {
    name: 'MEROUANE BALI',
    title: 'FULL STACK WEB DEVELOPER',
    bio: `Hi, I'm Merouane Bali, a passionate Full-Stack Web Developer with over three years of experience building dynamic, user-focused web applications and e-commerce platforms. I specialize in creating seamless digital experiences. From designing interactive front-end interfaces to architecting robust back-end systems, I thrive at every layer of the development stack. My expertise includes working with Frameworks like React.js, Next.js, and Express, as well as integrating APIs that enhance functionality and performance.\nAt the heart of my work is a commitment to combining creativity and functionality. I believe that great development goes beyond clean code--it's about crafting experiences that resonate with users and help businesses thrive. Whether I'm improving a platform's scalability, designing intuitive user interfaces, or exploring the latest technologies, my goal is to deliver solutions that make an impact.`,
    sections: [
      { key: 'quick-bio', label: 'QUICK BIO' },
      { key: 'background', label: 'BACKGROUND' },
      { key: 'focus', label: 'CURRENT FOCUS' },
      { key: 'hobbies', label: 'HOBBIES' },
    ],
    profileImage: '/profile.png',
    socials: [
      { type: 'github', url: 'https://github.com/yourid' },
      { type: 'linkedin', url: 'https://linkedin.com/in/yourid' },
      { type: 'email', url: 'mailto:your@email.com' },
    ],
  };

  const sectionCount = aboutMeData.sections.length;
  const contentBorderControls = useAnimation();
  const contentFadeControls = useAnimation();
  const slideDuration = 0.5;
  const dropDuration = 0.7;
  const borderDelay = sectionCount * 0.5 + 0.2;
  const dropDelay = borderDelay + slideDuration;

  useEffect(() => {
    // 섹션 border 애니메이션이 모두 끝난 후 컨텐츠 border 애니메이션 시작
    const totalSectionDelay = sectionCount * 0.2 + 0.2;
    const timer = setTimeout(() => {
      contentBorderControls.start({ height: '100%' });
    }, totalSectionDelay * 1000);
    return () => clearTimeout(timer);
  }, [sectionCount, contentBorderControls]);

  useEffect(() => {
    // 컨텐츠 border가 다 그려진 후 컨텐츠 페이드인
    const totalSectionDelay = sectionCount * 0.2 + 0.2;
    const contentBorderDuration = 0.5;
    const timer = setTimeout(
      () => {
        contentFadeControls.start({ opacity: 1 });
      },
      (totalSectionDelay + contentBorderDuration) * 1000,
    );
    return () => clearTimeout(timer);
  }, [sectionCount, contentFadeControls]);

  // 애니메이션 완료 후 콜백
  useEffect(() => {
    if (isClosing) {
      const totalDuration = 1.2; // dropDuration + slideDuration
      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, totalDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  return (
    <div
      className='fixed top-0 left-0 h-screen w-screen backdrop-blur-[2px] bg-transparent'
      style={{
        maxWidth: 'calc(4rem + 50vw)',
        maskImage: 'linear-gradient(to right, white 50%, transparent 100%)',
        opacity: 1,
      }}
    >
      <div
        className='fixed pl-4 mt-16 h-screen max-w-[50vw] flex flex-col gap-4 overflow-y-hidden'
        style={{
          top: '48px',
          maxHeight: 'calc(-128px - 8rem + 100vh)',
        }}
      >
        {/* 섹션 네온 탭 */}
        <div className='flex gap-4 ml-4'>
          {aboutMeData.sections.map((section, i) => (
            <div
              key={section.key}
              className='relative min-w-[180px] min-h-[70px] px-6 py-5 bg-white/5 text-white font-bold tracking-widest flex flex-col items-start justify-end mr-6 shadow-[0_0_12px_#22d3ee,0_0_4px_#67e8f9] border border-cyan-400/80'
              style={{
                clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)',
                boxShadow: '0 0 12px #22d3ee, 0 0 4px #67e8f9',
              }}
            >
              <span className='text-xs font-mono text-cyan-300 drop-shadow-[0_0_6px_#67e8f9] mb-2'>SEC-{i}</span>
              {/* 하단 강조선 */}
              <motion.div
                className='absolute left-0 bottom-0 h-[4px] bg-cyan-400 rounded shadow-[0_0_8px_#67e8f9]'
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.28, delay: i * 0.5 }}
                style={{ zIndex: 2 }}
              />
              {/* 오른쪽 border */}
              <motion.div
                className='absolute right-0 bottom-0 w-[2px] bg-cyan-400'
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 0.18, delay: i * 0.5 + 0.28 }}
                style={{ zIndex: 2 }}
              />
              {/* 상단 border */}
              <motion.div
                className='absolute right-0 top-0 h-[2px] bg-cyan-400'
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.18, delay: i * 0.5 + 0.46 }}
                style={{ zIndex: 2 }}
              />
              {/* 왼쪽 border */}
              <motion.div
                className='absolute left-0 top-0 w-[2px] bg-cyan-400'
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 0.18, delay: i * 0.5 + 0.64 }}
                style={{ zIndex: 2 }}
              />
              {/* 라벨 */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.5 + 0.82, duration: 0.22 }}
                className='text-cyan-100 text-lg font-extrabold tracking-widest drop-shadow-[0_0_6px_#67e8f9]'
                style={{
                  textShadow: '0 0 8px #67e8f9, 0 0 2px #fff',
                  letterSpacing: '0.15em',
                }}
              >
                {section.label}
              </motion.span>
            </div>
          ))}
        </div>
        {/* 본문: 좌측 텍스트, 우측 프로필 - border-bottom 슬라이드 → height 애니메이션 */}
        {(() => {
          // 1. border-bottom 슬라이드(왼→오)
          return (
            <>
              {!slideDone && !isClosing && (
                <motion.div
                  className='w-full h-[3px] overflow-hidden'
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: slideDuration, delay: borderDelay, ease: 'easeInOut' }}
                  onAnimationComplete={() => setSlideDone(true)}
                >
                  <div className='h-[3px] bg-cyan-400 shadow-[0_0_8px_#67e8f9] rounded-t w-full' />
                </motion.div>
              )}
              {(slideDone || isClosing) && (
                <motion.div
                  className='w-full flex flex-col gap-0 overflow-hidden'
                  initial={{ height: isClosing ? 272 : 3 }}
                  animate={{ height: isClosing ? 3 : 272 }}
                  transition={{ duration: dropDuration, ease: 'easeInOut' }}
                  style={{
                    minHeight: 0,
                    boxSizing: 'border-box',
                    background: 'rgba(0,0,0,0.25)',
                    borderBottom: '2px solid #22d3ee',
                  }}
                  onAnimationComplete={() => {
                    if (isClosing) {
                      setSlideDone(false);
                    }
                  }}
                >
                  <div className='flex flex-row gap-8 items-start w-full pt-4 h-full'>
                    <div className='flex-1 min-w-0'>
                      <div className='bg-transparent rounded-xl p-2'>
                        {aboutMeData.bio.split('\n').map((line, idx) => (
                          <p key={line} className='text-cyan-100 text-base font-mono mb-2 leading-relaxed'>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className='flex-shrink-0 ml-4'>
                      <div className='w-64 h-64 rounded-md shadow-2xl neon-glow flex items-center justify-center bg-black/60 overflow-hidden'>
                        <img src={aboutMeData.profileImage} alt='profile' className='w-56 h-56 object-cover' />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {/* border-bottom 슬라이드 아웃 (닫힐 때) */}
              {isClosing && (
                <motion.div
                  className='w-full h-[3px] overflow-hidden'
                  initial={{ width: '100%' }}
                  animate={{ width: 0 }}
                  transition={{ duration: slideDuration, delay: dropDuration, ease: 'easeInOut' }}
                >
                  <div className='h-[3px] bg-cyan-400 shadow-[0_0_8px_#67e8f9] rounded-t w-full' />
                </motion.div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
