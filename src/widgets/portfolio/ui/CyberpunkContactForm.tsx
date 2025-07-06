import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

type CyberpunkContactFormProps = {
  show: boolean;
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

  // 역순 애니메이션 완료 후 콜백 호출
  useEffect(() => {
    if (isClosing && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 800); // 애니메이션 시간과 맞춤
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.98 }}
          animate={isClosing ? { y: 80, opacity: 0, scale: 0.98 } : { y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          className={`max-w-md w-full p-8 rounded-xl border-2 border-violet-500/80 bg-black/40 shadow-[0_0_32px_4px_rgba(139,92,246,0.5)] relative ${className || ''}`}
          style={style}
        >
          <form className='flex flex-col gap-6 relative z-10'>
            <div className='flex gap-4'>
              <input
                type='text'
                name='name'
                placeholder='Full name'
                value={form.name}
                onChange={handleChange}
                className='w-1/2 bg-transparent border border-violet-400/60 rounded-md px-4 py-2 text-white placeholder:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition'
                autoComplete='off'
              />
              <input
                type='email'
                name='email'
                placeholder='Email'
                value={form.email}
                onChange={handleChange}
                className='w-1/2 bg-transparent border border-violet-400/60 rounded-md px-4 py-2 text-white placeholder:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition'
                autoComplete='off'
              />
            </div>
            <textarea
              name='message'
              placeholder='Message'
              value={form.message}
              onChange={handleChange}
              rows={5}
              className='bg-transparent border border-violet-400/60 rounded-md px-4 py-2 text-white placeholder:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none'
            />
            <div className='text-xs text-violet-300 flex items-center gap-1'>
              <span className='text-yellow-400'>⚡</span>
              NOTE: 문제가 있으면 <span className='underline underline-offset-2'>your@email.com</span> 으로 연락!
            </div>
            <button
              type='submit'
              className='mt-2 py-3 rounded-md bg-violet-500/90 text-white font-bold text-lg tracking-widest shadow-[0_0_16px_2px_rgba(139,92,246,0.7)] hover:bg-violet-400/90 hover:shadow-[0_0_32px_4px_rgba(139,92,246,0.9)] transition'
            >
              Send
            </button>
          </form>
          {/* 네온 각진 모서리 장식 */}
          <span className='absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-violet-400 rounded-tl-xl shadow-[0_0_8px_2px_rgba(139,92,246,0.7)]' />
          <span className='absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-violet-400 rounded-br-xl shadow-[0_0_8px_2px_rgba(139,92,246,0.7)]' />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
