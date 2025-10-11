import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';

interface ResumeConsoleOverlayProps {
  isOpen: boolean;
  isClosing: boolean;
  onAnimationComplete: () => void;
}

export const ResumeConsoleOverlay = ({ isOpen, isClosing, onAnimationComplete }: ResumeConsoleOverlayProps) => {
  const handleDownload = () => {
    // 파일 다운로드 로직
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'resume.pdf';
    link.click();
  };

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-start pl-72'
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            type='button'
            onClick={handleDownload}
            className='group relative px-8 py-4 bg-gradient-to-br from-[#E5D6C4]/20 to-[#E5D6C4]/5 backdrop-blur-md text-[#E5D6C4] rounded-lg border-2 border-[#E5D6C4]/50 font-mono text-lg font-bold cursor-pointer transition-all duration-300 hover:border-[#E5D6C4] hover:shadow-2xl hover:shadow-[#E5D6C4]/40 active:scale-95'
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: isClosing ? 0 : 1,
              rotate: isClosing ? 180 : 0,
            }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            onAnimationComplete={() => {
              // 버튼 애니메이션 완료 후 호출
              if (isClosing) {
                onAnimationComplete();
              }
            }}
          >
            {/* 네온 글로우 효과 */}
            <div className='absolute inset-0 rounded-lg bg-[#E5D6C4]/10 blur-xl group-hover:bg-[#E5D6C4]/20 transition-all duration-300' />

            {/* 버튼 내용 */}
            <div className='relative flex items-center gap-3'>
              <Download className='w-6 h-6 animate-bounce' />
              <span className='neon-glow'>DOWNLOAD RESUME</span>
            </div>

            {/* 호버 시 추가 효과 */}
            <motion.div
              className='absolute inset-0 rounded-lg border-2 border-[#E5D6C4] opacity-0 group-hover:opacity-100 transition-opacity duration-300'
              initial={false}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
