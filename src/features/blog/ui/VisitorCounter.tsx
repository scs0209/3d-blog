import { useEffect, useRef } from 'react';
import { motion, useAnimate } from 'framer-motion';

export const VisitorCounter = ({
  today,
  total,
}: {
  today: number;
  total: number;
}) => {
  const [counterRef, animate] = useAnimate();
  const prevCountRef = useRef(total);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // 숫자가 변경될 때만 애니메이션 적용
    if (prevCountRef.current !== total) {
      animate(counterRef.current, { scale: [1, 1.2, 1] }, { duration: 0.5 });
      prevCountRef.current = total;
    }
  }, [total, animate]);

  // 숫자를 배열로 변환
  const digits = total.toString().split('');

  return (
    <div className='relative w-full'>
      <div className='absolute inset-0 bg-gradient-to-r from-blue-900/40 to-fuchsia-900/30 rounded-xl rotate-2 scale-105 blur-md' />
      <motion.div
        className='bg-[#181c2a]/80 px-3 py-2 rounded-xl border border-blue-400/40 backdrop-blur-md relative shadow-[0_0_12px_2px_#7dd3fc33] flex flex-col items-center'
        whileHover={{
          rotateY: 10,
          rotateX: 3,
          scale: 1.01,
        }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className='flex flex-row items-end gap-4'>
          {/* 오늘 방문자 */}
          <div className='flex flex-col items-center'>
            <span className='text-[10px] text-blue-200 font-semibold mb-1 tracking-tight'>오늘</span>
            <div className='flex space-x-0.5'>
              {today
                .toString()
                .split('')
                .map((digit) => (
                  <motion.div
                    key={`today-${digit}-${today}`}
                    className='w-5 h-7 bg-gradient-to-b from-blue-600 via-blue-400 to-blue-800 rounded-md flex items-center justify-center text-base font-extrabold text-white/90 border border-blue-300/40 shadow-[0_0_8px_#7dd3fc55]'
                    initial={{ rotateX: -90 }}
                    animate={{ rotateX: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {digit}
                  </motion.div>
                ))}
            </div>
          </div>
          {/* 총 방문자 */}
          <div className='flex flex-col items-center'>
            <span className='text-[10px] text-fuchsia-200 font-semibold mb-1 tracking-tight'>전체</span>
            <div className='flex space-x-0.5'>
              {total
                .toString()
                .split('')
                .map((digit) => (
                  <motion.div
                    key={`total-${digit}-${total}`}
                    className='w-5 h-7 bg-gradient-to-b from-fuchsia-500 via-blue-400 to-blue-800 rounded-md flex items-center justify-center text-base font-extrabold text-white/90 border border-fuchsia-400/40 shadow-[0_0_8px_#f472b655]'
                    initial={{ rotateX: -90 }}
                    animate={{ rotateX: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {digit}
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
        {/* LED 효과 */}
        <div className='flex justify-center mt-1 space-x-0.5'>
          {total
            .toString()
            .split('')
            .map((digit) => (
              <motion.div
                key={`led-${digit}-${total}`}
                className='w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_4px_1px_#7dd3fc99]'
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            ))}
        </div>
      </motion.div>
    </div>
  );
};
