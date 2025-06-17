import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  skills: string[];
}

const experiences: Experience[] = [
  {
    id: 'XP_03',
    company: 'EZ TELECOM',
    role: 'FULL STACK WEB DEVELOPER',
    period: 'JAN 2025 - PRESENT',
    location: 'SPAIN',
    description: [
      "Led the front-end redesign and development of EZ Telecom's public website as part of a complete rebranding effort, delivering a modern, responsive, and user-friendly experience tailored to the company's telecom products and subscription model.",
      'Collaborated with brand and marketing teams to transform a static branding book into an interactive and responsive web experience, ensuring visual consistency and user-focused design.',
      'Built a performant front-end architecture using modern frameworks and component-based design, optimising for responsiveness, reusability, and future scalability within a subscription-based platform.',
      'Coordinated closely with backend developers to integrate and request updates to existing APIs, enabling new features on the front-end and ensuring seamless functionality across systems.',
    ],
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'GraphQL'],
  },
  {
    id: 'XP_02',
    company: 'PAWSITIVE DOG FOOD',
    role: 'FULL STACK WEB DEVELOPER',
    period: 'MAY 2022 - SEP 2024',
    location: 'UNITED KINGDOM',
    description: [
      "Developed and maintained the company's e-commerce platform, focusing on user experience and performance optimization.",
      'Implemented secure payment processing systems and inventory management features.',
      'Created a customer loyalty program that increased repeat purchases by 40%.',
      'Led the migration from a monolithic architecture to a microservices-based system.',
    ],
    skills: ['Vue.js', 'Node.js', 'MongoDB', 'Docker', 'AWS', 'Stripe API'],
  },
  {
    id: 'XP_01',
    company: 'BRAVO FOOD',
    role: 'FULL STACK APP DEVELOPER',
    period: 'DEC 2021 - MAR 2022',
    location: 'ALGERIA',
    description: [
      'Built a mobile-first food delivery application using React Native.',
      'Integrated real-time order tracking and push notifications.',
      'Optimized app performance and reduced load times by 60%.',
      'Implemented a robust caching system for offline functionality.',
    ],
    skills: ['React Native', 'Firebase', 'Redux', 'Node.js', 'MongoDB'],
  },
];

export function ExperiencePage({ isClosing = false, onClose }: { isClosing?: boolean; onClose?: () => void }) {
  const [selectedExp, setSelectedExp] = useState<string>('XP_03');
  const [slideDone, setSlideDone] = useState(false);
  const [contentKey, setContentKey] = useState(0);

  const contentBorderControls = useAnimation();
  const contentFadeControls = useAnimation();
  const slideDuration = 0.5;
  const dropDuration = 0.7;

  useEffect(() => {
    setSlideDone(false);
    setContentKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      contentBorderControls.start({ height: '100%' });
    }, 200);
    return () => clearTimeout(timer);
  }, [contentBorderControls]);

  useEffect(() => {
    const timer = setTimeout(() => {
      contentFadeControls.start({ opacity: 1 });
    }, 700);
    return () => clearTimeout(timer);
  }, [contentFadeControls]);

  useEffect(() => {
    if (isClosing) {
      const totalDuration = 1.2;
      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, totalDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  return (
    <div className='fixed top-14 left-0 h-screen w-screen backdrop-blur-[2px] bg-transparent'>
      <div
        className='fixed pl-4 mt-16 h-screen w-full flex flex-row gap-6 overflow-hidden'
        style={{
          top: '48px',
          maxHeight: 'calc(-128px - 8rem + 100vh)',
        }}
      >
        {/* 왼쪽: 경험 카드들 */}
        <div className='w-[280px] flex-shrink-0 flex flex-col gap-4'>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className={`relative px-6 py-5 bg-black/20 text-white font-bold tracking-widest flex flex-col items-start justify-end cursor-pointer transition-all duration-300 ${
                selectedExp === exp.id
                  ? 'shadow-[0_0_20px_#8b5cf6,0_0_10px_#a78bfa] border-violet-300'
                  : 'shadow-[0_0_12px_#8b5cf6,0_0_4px_#a78bfa] border-violet-400/50'
              }`}
              style={{
                clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)',
                borderWidth: '1px',
              }}
              onClick={() => setSelectedExp(exp.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedExp(exp.id);
                }
              }}
            >
              <span className='text-xs font-mono text-violet-300 drop-shadow-[0_0_6px_#a78bfa] mb-2'>{exp.id}</span>
              <span className='text-violet-100 text-lg font-extrabold tracking-widest drop-shadow-[0_0_6px_#a78bfa]'>
                {exp.company}
              </span>
              <span className='text-violet-200 text-sm font-mono mt-2'>{exp.role}</span>
              <div className='flex flex-col gap-1 w-full mt-4 text-xs font-mono text-violet-300'>
                <span>{exp.period}</span>
                <span>{exp.location}</span>
              </div>

              {/* 하단 강조선 */}
              <motion.div
                className='absolute left-0 bottom-0 h-[2px] bg-violet-400 rounded shadow-[0_0_8px_#a78bfa]'
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.28 }}
                style={{ zIndex: 2 }}
              />
            </div>
          ))}
        </div>

        {/* 오른쪽: 선택된 경험 상세 내용 */}
        <div className='flex-1 min-w-0 overflow-y-auto pr-6'>
          {(() => {
            const selectedExperience = experiences.find((exp) => exp.id === selectedExp);
            if (!selectedExperience) {
              return null;
            }

            return (
              <>
                {!slideDone && !isClosing && (
                  <motion.div
                    className='w-full h-[3px] overflow-hidden'
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: slideDuration, ease: 'easeInOut' }}
                    onAnimationComplete={() => setSlideDone(true)}
                  >
                    <div className='h-[3px] bg-violet-400 shadow-[0_0_8px_#a78bfa] rounded-t w-full' />
                  </motion.div>
                )}
                {(slideDone || isClosing) && (
                  <div className='w-full bg-black/25' style={{ borderBottom: '2px solid #8b5cf6' }}>
                    <motion.div
                      key={contentKey}
                      className='w-full flex flex-col gap-4'
                      initial={{ height: isClosing ? '100%' : 0, opacity: isClosing ? 1 : 0 }}
                      animate={{ height: isClosing ? 0 : 'auto', opacity: isClosing ? 0 : 1 }}
                      transition={{
                        height: { duration: dropDuration, ease: 'easeInOut' },
                        opacity: { duration: 0.3, delay: dropDuration * 0.5 },
                      }}
                    >
                      {/* 설명 */}
                      <div className='space-y-4 p-6'>
                        {selectedExperience.description.map((desc) => (
                          <p key={desc} className='text-violet-100 text-base font-mono leading-relaxed'>
                            {desc}
                          </p>
                        ))}
                      </div>

                      {/* 기술 스택 */}
                      <div className='mt-6 p-6'>
                        <h3 className='text-violet-300 font-bold mb-3'>TECHNOLOGIES</h3>
                        <div className='flex flex-wrap gap-2'>
                          {selectedExperience.skills.map((skill) => (
                            <span
                              key={skill}
                              className='px-3 py-1 bg-violet-900/30 border border-violet-400 rounded-full text-violet-200 text-sm font-mono shadow-[0_0_8px_#8b5cf6]'
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
                {isClosing && (
                  <motion.div
                    className='w-full h-[3px] overflow-hidden'
                    initial={{ width: '100%' }}
                    animate={{ width: 0 }}
                    transition={{ duration: slideDuration, delay: dropDuration, ease: 'easeInOut' }}
                  >
                    <div className='h-[3px] bg-violet-400 shadow-[0_0_8px_#a78bfa] rounded-t w-full' />
                  </motion.div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
