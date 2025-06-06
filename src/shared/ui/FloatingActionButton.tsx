'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Home, HelpCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const MenuItem = ({ icon, label, onClick }: MenuItemProps) => (
  <motion.button
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className='flex items-center gap-3 w-full p-3 rounded-lg bg-black/40 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-200'
  >
    <div className='w-5 h-5 text-cyan-400'>{icon}</div>
    <span className='text-sm text-white font-medium'>{label}</span>
  </motion.button>
);

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 외부 클릭시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHomeClick = () => {
    router.push('/');
    setIsOpen(false);
  };

  const handleHelpClick = () => {
    setShowHelpModal(true);
    setIsOpen(false);
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <div ref={buttonRef} className='fixed top-6 right-6 z-50'>
        {/* 메인 플로팅 버튼 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className='w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center group relative overflow-hidden'
          style={{
            boxShadow: '0 0 20px rgba(0, 255, 208, 0.4), 0 0 40px rgba(0, 255, 208, 0.2)',
          }}
        >
          {/* 글로우 효과 */}
          <div className='absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300' />

          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            {isOpen ? <X className='w-6 h-6 text-black' /> : <Menu className='w-6 h-6 text-black' />}
          </motion.div>
        </motion.button>

        {/* 메뉴 리스트 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              className='absolute top-16 right-0 w-56 p-3 rounded-xl bg-black/60 backdrop-blur-xl border border-cyan-500/40 shadow-2xl'
              style={{
                boxShadow: '0 8px 32px rgba(0, 255, 208, 0.2)',
              }}
            >
              <div className='space-y-2'>
                <MenuItem icon={<Home />} label='메인 페이지로' onClick={handleHomeClick} />
                <MenuItem icon={<HelpCircle />} label='블로그 가이드' onClick={handleHelpClick} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 도움말 모달 */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm'
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className='max-w-md mx-4 p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-cyan-500/40'
              style={{
                boxShadow: '0 0 40px rgba(0, 255, 208, 0.3)',
                zIndex: 1000,
              }}
            >
              <div className='flex items-center gap-3 mb-4'>
                <HelpCircle className='w-6 h-6 text-cyan-400' />
                <h3 className='text-xl font-bold text-white'>블로그 가이드</h3>
              </div>

              <div className='space-y-3 text-gray-300'>
                <p className='text-sm leading-relaxed'>
                  <span className='text-cyan-400 font-medium'>스크롤</span>을 내리면 블로그 페이지로 이동할 수 있습니다.
                </p>
                <p className='text-sm leading-relaxed'>
                  3D 환경에서 마우스를 드래그하여 시점을 변경하고, 휠을 사용하여 줌인/줌아웃할 수 있습니다.
                </p>
                <p className='text-sm leading-relaxed'>
                  화면의 다양한 <span className='text-cyan-400 font-medium'>3D 오브젝트들</span>을 클릭하여 인터랙션을
                  즐겨보세요!
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHelpModal(false)}
                className='mt-6 w-full py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200'
              >
                확인
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
