import { AnimatePresence, motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { OverlayPanel } from './OverlayShell';
import { overlayStyles } from './overlayStyles';

interface ResumeConsoleOverlayProps {
  isOpen: boolean;
  isClosing: boolean;
  onAnimationComplete: () => void;
}

export const ResumeConsoleOverlay = ({ isOpen, isClosing, onAnimationComplete }: ResumeConsoleOverlayProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'resume.pdf';
    link.click();
  };

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <motion.div
          className='w-full'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? 20 : 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            if (isClosing) {
              onAnimationComplete();
            }
          }}
        >
          <OverlayPanel className='p-6 flex flex-col gap-4'>
            <p className={overlayStyles.subtitle}>이력서 PDF를 다운로드합니다</p>

            <button type='button' onClick={handleDownload} className={`${overlayStyles.buttonPrimary} w-full`}>
              <span className='relative flex items-center justify-center gap-3'>
                <Download className='w-4 h-4' />
                <span>DOWNLOAD PDF</span>
              </span>
            </button>
          </OverlayPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
