'use client';

import { motion, AnimatePresence } from 'framer-motion';

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
  console.log('showPortfolioOverlay', showPortfolioOverlay);
  console.log('portfolioExiting', portfolioExiting);
  return (
    <AnimatePresence>
      {showPortfolioOverlay && (
        <motion.div
          className='fixed inset-0 z-[9999] bg-black text-white font-mono overflow-auto'
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{
            opacity: 1,
            scale: 1, // 창은 항상 크기 유지
          }}
          exit={{ opacity: 0, scale: 0.1 }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
          onAnimationComplete={onAnimationComplete}
        >
          {showPortfolioContent && (
            <>
              {/* 헤더 */}
              <motion.div
                className='flex justify-between items-center p-8 border-b border-cyan-400'
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
                <div>
                  <h1 className='text-4xl font-bold text-cyan-400 neon-glow'>WORKS</h1>
                  <p className='text-cyan-300 text-sm mt-2'>Portfolio Projects</p>
                </div>
                <button
                  type='button'
                  onClick={onExit}
                  className='px-6 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-cyan-400/50 font-bold'
                >
                  EXIT
                </button>
              </motion.div>

              {/* 프로젝트 그리드 */}
              <motion.div
                className='p-8'
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
                        <motion.div
                          key={project.id}
                          className='border border-cyan-400 bg-gray-900 hover:bg-gray-800 transition-colors'
                          initial={{ opacity: 0, y: 100 }} // 아래에서 시작
                          animate={{
                            opacity: portfolioExiting ? 0 : 1,
                            y: portfolioExiting ? -100 : 0, // EXIT시 위로 사라짐
                          }}
                          exit={{ opacity: 0, y: -100 }}
                          transition={{
                            duration: 0.6,
                            delay: portfolioExiting
                              ? (portfolioProjects.length - 1 - index) * 0.2 // 역순으로 사라짐 (마지막부터)
                              : index * 0.3, // 순차적으로 나타남 (첫 번째부터)
                            ease: 'easeInOut',
                          }}
                          whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.2 },
                          }}
                        >
                          {/* 프로젝트 이미지 */}
                          <div className='h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-b border-cyan-400 overflow-hidden'>
                            <div className='text-center transform transition-transform duration-300 hover:scale-110'>
                              <div className='text-cyan-400 text-6xl mb-4 transform transition-transform duration-500 hover:rotate-12'>
                                📁
                              </div>
                              <div className='text-cyan-300'>PROJECT {index + 1}</div>
                            </div>
                          </div>

                          {/* 프로젝트 정보 */}
                          <div className='p-6 transform transition-all duration-300 hover:bg-gray-800'>
                            <h3 className='text-xl font-bold text-cyan-400 mb-2'>{project.title}</h3>
                            <p className='text-cyan-300 text-sm mb-4'>{project.subtitle}</p>
                            <p className='text-gray-300 text-sm mb-6 leading-relaxed'>{project.description}</p>

                            <div className='flex gap-4'>
                              <button
                                type='button'
                                className='flex-1 py-2 px-4 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 text-sm transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/30'
                              >
                                VIEW LIVE
                              </button>
                              <button
                                type='button'
                                className='flex-1 py-2 px-4 bg-cyan-400 text-black hover:bg-cyan-300 transition-all duration-300 text-sm transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/50'
                              >
                                SOURCE CODE
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* 푸터 */}
              <motion.div
                className='border-t border-cyan-400 p-8 text-center'
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: portfolioExiting ? 0 : 1,
                  y: portfolioExiting ? 50 : 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: portfolioExiting ? 0.2 : 0.8,
                }}
              >
                <div className='flex justify-center items-center gap-8 text-cyan-300 text-sm'>
                  <span>© 2025</span>
                  <a
                    href='https://github.com/yourid'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-cyan-400'
                  >
                    GITHUB
                  </a>
                  <a href='mailto:your@email.com' className='hover:text-cyan-400'>
                    EMAIL
                  </a>
                  <span>LINKEDIN</span>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
