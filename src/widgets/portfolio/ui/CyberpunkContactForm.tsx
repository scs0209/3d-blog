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
          className={`relative overflow-visible max-w-md w-full p-8 rounded-2xl border border-white/60 bg-white/10 backdrop-blur-md shadow ${className || ''}`}
          style={style}
        >
          {/* Cyberpunk SVG Frame */}
          <svg
            className='absolute inset-0 w-full h-full pointer-events-none z-0'
            viewBox='0 0 100 100'
            preserveAspectRatio='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>Cyberpunk frame</title>
            {/* 네 변 border */}
            <line x1='8' y1='0' x2='92' y2='0' stroke='white' strokeWidth='1.5' />
            <line x1='100' y1='8' x2='100' y2='92' stroke='white' strokeWidth='1.5' />
            <line x1='92' y1='100' x2='8' y2='100' stroke='white' strokeWidth='1.5' />
            <line x1='0' y1='92' x2='0' y2='8' stroke='white' strokeWidth='1.5' />
            {/* 좌상단 ┏ */}
            <polyline points='0,16 0,0 16,0' stroke='white' strokeWidth='3.5' fill='none' />
            {/* 우상단 ┓ */}
            <polyline points='84,0 100,0 100,16' stroke='white' strokeWidth='3.5' fill='none' />
            {/* 우하단 ┛ */}
            <polyline points='100,84 100,100 84,100' stroke='white' strokeWidth='3.5' fill='none' />
            {/* 좌하단 ┗ */}
            <polyline points='16,100 0,100 0,84' stroke='white' strokeWidth='3.5' fill='none' />
          </svg>
          <form className='flex flex-col gap-6 relative z-10'>
            <div className='flex gap-4'>
              <input
                type='text'
                name='name'
                placeholder='이름'
                value={form.name}
                onChange={handleChange}
                className='w-1/2 bg-white/10 border border-white/60 rounded-lg px-4 py-2 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white transition backdrop-blur-md'
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
                className='w-1/2 bg-white/10 border border-white/60 rounded-lg px-4 py-2 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white transition backdrop-blur-md'
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
              className='bg-white/10 border border-white/60 rounded-lg px-4 py-2 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white transition resize-none backdrop-blur-md'
              aria-label='메시지'
              tabIndex={0}
            />
            <div className='text-xs text-white flex items-center gap-1'>
              <span className='text-white'>💬</span>
              문의가 잘 안되면 <span className='underline underline-offset-2 text-white'>your@email.com</span> 으로
              연락!
            </div>
            <button
              type='submit'
              className='mt-2 py-3 rounded-lg bg-white/10 text-white font-bold text-lg tracking-widest shadow hover:bg-white/20 hover:text-slate-900 hover:shadow-xl transition focus:outline-none focus:ring-2 focus:ring-white'
              aria-label='메시지 보내기'
              tabIndex={0}
            >
              보내기
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
