'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphismCard, GlassmorphismButton } from '@/shared/ui/glassmorphism';

interface PortfolioProject {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  liveUrl: string;
}

interface PortfolioOverlayProps {
  showPortfolioOverlay: boolean;
  portfolioExiting: boolean;
  showPortfolioContent: boolean;
  showCards: boolean;
  onExit: () => void;
  onAnimationComplete: () => void;
}

const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    title: 'PAWSITIVE DOG FOOD',
    subtitle: 'International e-commerce platform',
    description:
      'A custom-made, responsive, fully-fledged e-commerce platform for a UK company, serving over 13K monthly visitors across the UK and Ireland. It includes a public e-commerce portal and a private customer portal, a POS, Shopify store integration, a payment gateway, detailed analytics, and more.',
    image: '/assets/images/project1.jpg',
    liveUrl: 'https://example.com',
  },
  {
    id: 2,
    title: "MERCHIANE BALI'S PORTFOLIO V1",
    subtitle: 'Personal portfolio website',
    description:
      'The first version of my portfolio website, showcasing my skills, projects, and experience as a developer. It features a 3D design and smooth navigation, emphasizing responsiveness across devices.',
    image: '/assets/images/project2.jpg',
    liveUrl: 'https://example.com',
  },
  {
    id: 3,
    title: "ZIME FUMUDOH'S PORTFOLIO",
    subtitle: 'Creative personal website',
    description:
      "A remake of Fumudoh's personal website, inspired by an award-winning Squarespace template. Built using standard web technologies, it features engaging animations created with GSAP and WebGL, enhancing the site's visual appeal and interactivity.",
    image: '/assets/images/project3.jpg',
    liveUrl: 'https://example.com',
  },
];

export function PortfolioOverlay({
  showPortfolioOverlay,
  portfolioExiting,
  showPortfolioContent,
  showCards,
  onExit,
  onAnimationComplete,
}: PortfolioOverlayProps) {
  return (
    <AnimatePresence>
      {showPortfolioOverlay && (
        <motion.div
          className='fixed inset-0 z-[9999] bg-black/10 backdrop-blur-xl text-white font-mono overflow-auto'
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{ opacity: 0, scale: 0.1 }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
          onAnimationComplete={onAnimationComplete}
        >
          {showPortfolioContent && (
            <div className='min-h-screen p-4'>
              {/* 헤더 */}
              <motion.div
                className='flex justify-between items-center p-8 mb-8'
                initial={{ opacity: 0, y: -50 }}
                animate={{
                  opacity: portfolioExiting ? 0 : 1,
                  y: portfolioExiting ? -50 : 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: portfolioExiting ? 1.0 : 0,
                }}
              >
                <GlassmorphismButton
                  variant='outline'
                  size='lg'
                  onClick={onExit}
                  className='transform hover:scale-110 hover:shadow-lg hover:shadow-white/30'
                >
                  EXIT
                </GlassmorphismButton>
              </motion.div>

              {/* 프로젝트 그리드 */}
              <motion.div
                className='mb-8'
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: portfolioExiting ? 0 : 1,
                  y: portfolioExiting ? 30 : 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: portfolioExiting ? 0.6 : 0.2,
                }}
              >
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
                  <AnimatePresence>
                    {showCards &&
                      portfolioProjects.map((project, index) => (
                        <GlassmorphismCard
                          key={project.id}
                          className='overflow-hidden'
                          initial={{ opacity: 0, y: 100 }}
                          animate={{
                            opacity: portfolioExiting ? 0 : 1,
                            y: portfolioExiting ? -100 : 0,
                          }}
                          exit={{ opacity: 0, y: -100 }}
                          transition={{
                            duration: 0.6,
                            delay: portfolioExiting ? (portfolioProjects.length - 1 - index) * 0.2 : index * 0.3,
                            ease: 'easeInOut',
                          }}
                        >
                          {/* 프로젝트 이미지 */}
                          <div className='h-64 bg-gradient-to-br from-white/3 to-white/8 flex items-center justify-center border-b border-white/15 overflow-hidden'>
                            <div className='text-center transform transition-transform duration-300 hover:scale-110'>
                              <div className='text-white text-6xl mb-4 transform transition-transform duration-500 hover:rotate-12'>
                                📁
                              </div>
                              <div className='text-white/70'>PROJECT {index + 1}</div>
                            </div>
                          </div>

                          {/* 프로젝트 정보 */}
                          <div className='p-6'>
                            <h3 className='text-xl font-bold text-white mb-2'>{project.title}</h3>
                            <p className='text-white/70 text-sm mb-4'>{project.subtitle}</p>
                            <p className='text-white/80 text-sm mb-6 leading-relaxed'>{project.description}</p>

                            <div className='flex gap-4'>
                              <GlassmorphismButton variant='outline' size='sm' className='flex-1'>
                                VIEW LIVE
                              </GlassmorphismButton>
                              <GlassmorphismButton variant='primary' size='sm' className='flex-1'>
                                SOURCE CODE
                              </GlassmorphismButton>
                            </div>
                          </div>
                        </GlassmorphismCard>
                      ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
