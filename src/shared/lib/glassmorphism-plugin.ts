/**
 * Glassmorphism Tailwind Plugin
 * 글래스모피즘 효과를 위한 커스텀 컴포넌트들
 */

export const glassmorphismPlugin = function ({ addComponents }: { addComponents: Function }) {
  const glassComponents = {
    // Basic Glass Effects (box-shadow 제거, 더 자연스러운 색상)
    '.bg-glass': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
    },
    '.bg-glass-dark': {
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
    },
    '.bg-glass-subtle': {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '12px',
    },
    '.bg-glass-strong': {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '24px',
    },

    // 더 자연스러운 컬러 (투명도 조정, CSS 변수 활용)
    '.bg-glass-blue': {
      background: 'rgba(59, 130, 246, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
    },
    '.bg-glass-purple': {
      background: 'rgba(147, 51, 234, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(147, 51, 234, 0.2)',
      borderRadius: '20px',
    },
    '.bg-glass-green': {
      background: 'rgba(34, 197, 94, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      borderRadius: '20px',
    },
    '.bg-glass-red': {
      background: 'rgba(239, 68, 68, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '20px',
    },

    // 간단한 글래스 카드들 (box-shadow 없음)
    '.glass-card': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      },
    },
    '.glass-card-subtle': {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      },
    },
    '.glass-card-strong': {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '24px',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
      },
    },

    // 간단한 글래스 버튼들
    '.btn-glass': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      padding: '12px 24px',
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'scale(1.02)',
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    },
    '.btn-glass-primary': {
      background: 'rgba(59, 130, 246, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '12px 24px',
      color: 'rgba(59, 130, 246, 1)',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(59, 130, 246, 0.15)',
        transform: 'scale(1.02)',
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    },

    // 사선 반짝이 효과 (Shimmer)
    '.glass-shimmer': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)',
        animation: 'shimmer-diagonal 3s ease-in-out infinite',
        pointerEvents: 'none',
      },
    },

    '.glass-card-shimmer': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%)',
        animation: 'shimmer-diagonal 4s ease-in-out infinite',
        pointerEvents: 'none',
      },
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        '&::before': {
          animationDuration: '2s',
        },
      },
    },

    // 컬러 버전 shimmer
    '.glass-blue-shimmer': {
      background: 'rgba(59, 130, 246, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.3) 50%, transparent 70%)',
        animation: 'shimmer-diagonal 3s ease-in-out infinite',
        pointerEvents: 'none',
      },
    },

    // 자연스러운 Float 효과 (호버시 눌리는 효과)
    '.glass-float': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      transform: 'translateY(-6px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.12)',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-1px)',
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.08)',
      },
    },

    '.glass-card-float': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      transform: 'translateY(-8px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 10px 20px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
      },
      '&:active': {
        transform: 'translateY(0px)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
      },
    },

    '.glass-card-float-shimmer': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      transform: 'translateY(-8px)',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%)',
        animation: 'shimmer-diagonal 4s ease-in-out infinite',
        pointerEvents: 'none',
      },
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
        '&::before': {
          animationDuration: '2s',
        },
      },
      '&:active': {
        transform: 'translateY(0px)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
      },
    },

    // 컬러 Float 버전들 (호버시 눌리는 효과)
    '.glass-blue-float': {
      background: 'rgba(59, 130, 246, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 30px rgba(59, 130, 246, 0.2)',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'rgba(59, 130, 246, 0.15)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(59, 130, 246, 0.15)',
      },
    },

    '.glass-purple-float': {
      background: 'rgba(147, 51, 234, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(147, 51, 234, 0.2)',
      borderRadius: '20px',
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 30px rgba(147, 51, 234, 0.2)',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'rgba(147, 51, 234, 0.15)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(147, 51, 234, 0.15)',
      },
    },

    // 호버 효과 없는 정적 글래스 카드 (테이블용)
    '.glass-card-static': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      transform: 'translateY(-8px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 10px 20px rgba(0, 0, 0, 0.15)',
    },

    // 테이블 행용 호버 효과
    '.glass-row-hover': {
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.12)',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
      },
    },

    // Float 버튼 (호버시 눌리는 효과)
    '.btn-glass-float': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      padding: '12px 24px',
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '500',
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      '&:active': {
        transform: 'translateY(0px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    },
  };

  addComponents(glassComponents);
};
