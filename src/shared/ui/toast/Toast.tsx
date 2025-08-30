'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { Toast as ToastType } from './types';

// 토스트 타입별 아이콘과 색상
const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-400/40',
    textColor: 'text-green-200',
    iconColor: 'text-green-400',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-400/40',
    textColor: 'text-red-200',
    iconColor: 'text-red-400',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400/40',
    textColor: 'text-yellow-200',
    iconColor: 'text-yellow-400',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-400/40',
    textColor: 'text-blue-200',
    iconColor: 'text-blue-400',
  },
};

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

export const Toast = memo(function Toast({ toast, onRemove }: ToastProps) {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  const handleRemove = () => {
    onRemove(toast.id);
  };

  return (
    <div
      className={`
        relative w-full max-w-sm p-4 rounded-lg border backdrop-blur-md
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        shadow-lg shadow-black/20
      `}
      role='alert'
      aria-live='polite'
      aria-atomic='true'
    >
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
