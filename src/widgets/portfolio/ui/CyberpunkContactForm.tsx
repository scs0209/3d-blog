import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { OverlayPanel } from './OverlayShell';
import { overlayStyles } from './overlayStyles';

type CyberpunkContactFormProps = {
  show?: boolean;
  isClosing?: boolean;
  onClose?: () => void;
  style?: React.CSSProperties;
  className?: string;
};

export const CyberpunkContactForm = ({
  show,
  isClosing = false,
  onClose,
  style,
  className,
}: CyberpunkContactFormProps) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isClosing && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={isClosing ? { y: 40, opacity: 0 } : { y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          className={`w-full ${className || ''}`}
          style={style}
        >
          <OverlayPanel className='p-6'>
            <form className='flex flex-col gap-4'>
              <p className={overlayStyles.subtitle}>메시지를 남겨주세요</p>

              <div className='flex gap-3'>
                <input
                  type='text'
                  name='name'
                  placeholder='이름'
                  value={form.name}
                  onChange={handleChange}
                  className={`${overlayStyles.input} w-1/2`}
                  autoComplete='off'
                  aria-label='이름'
                  tabIndex={0}
                />
                <input
                  type='email'
                  name='email'
                  placeholder='이메일'
                  value={form.email}
                  onChange={handleChange}
                  className={`${overlayStyles.input} w-1/2`}
                  autoComplete='off'
                  aria-label='이메일'
                  tabIndex={0}
                />
              </div>
              <textarea
                name='message'
                placeholder='메시지'
                value={form.message}
                onChange={handleChange}
                rows={5}
                className={`${overlayStyles.input} resize-none`}
                aria-label='메시지'
                tabIndex={0}
              />
              <p className={overlayStyles.subtitle}>
                문의가 잘 안되면{' '}
                <a
                  href='mailto:tjdckdtn2463@naver.com'
                  className='underline underline-offset-2 text-[#E5D6C4]/80 hover:text-[#E5D6C4]'
                >
                  tjdckdtn2463@naver.com
                </a>
              </p>
              <button type='submit' className={overlayStyles.buttonPrimary} aria-label='메시지 보내기' tabIndex={0}>
                SEND MESSAGE
              </button>
            </form>
          </OverlayPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
