import { cva } from 'class-variance-authority';

export const toastVariants = cva(
  'relative w-full max-w-sm p-4 rounded-lg border backdrop-blur-md shadow-lg shadow-black/20',
  {
    variants: {
      type: {
        success: 'bg-green-500/20 border-green-400/40 text-green-200',
        error: 'bg-red-500/20 border-red-400/40 text-red-200',
        warning: 'bg-yellow-500/20 border-yellow-400/40 text-yellow-200',
        info: 'bg-blue-500/20 border-blue-400/40 text-blue-200',
      },
    },
    defaultVariants: {
      type: 'info',
    },
  },
);
