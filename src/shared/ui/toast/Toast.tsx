'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { Toast as ToastType } from './types';
import { toastVariants } from './utils';

// 토스트 타입별 아이콘과 색상
const iconConfig = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-400',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-400',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-400',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-400',
  },
};

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

export const Toast = memo(function Toast({ toast, onRemove }: ToastProps) {
  const config = iconConfig[toast.type];
  const Icon = config.icon;

  const handleRemove = () => {
    onRemove(toast.id);
  };

  return (
    <div className={toastVariants({ type: toast.type })} role='alert' aria-live='polite' aria-atomic='true'>
      {/* 닫기 버튼 */}
      <button
        type='button'
        onClick={handleRemove}
        className={`
          absolute top-2 right-2 p-1 rounded-full opacity-60 hover:opacity-100
          hover:bg-white/10 transition-all duration-200
          ${config.iconColor}
        `}
        aria-label='토스트 닫기'
      >
        <X size={16} />
      </button>

      {/* 아이콘과 내용 */}
      <div className='flex items-start gap-3 pr-6'>
        <Icon size={20} className={`mt-0.5 flex-shrink-0 ${config.iconColor}`} />

        <div className='flex-1 min-w-0'>
          {/* 제목 */}
          {toast.title && <h4 className='font-semibold text-sm mb-1 leading-tight'>{toast.title}</h4>}

          {/* 메시지 */}
          <p className='text-sm leading-relaxed break-words'>{toast.message}</p>
        </div>
      </div>

      {/* 진행 바 (persistent가 아닌 경우) */}
      {!toast.persistent && toast.duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${config.iconColor} bg-current`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}
    </div>
  );
});
