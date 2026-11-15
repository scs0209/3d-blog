'use client';

import { useVisitor } from '@/features/visitor/model';

const formatNumber = (num: number | undefined) => (num == null ? '—' : num.toLocaleString('en-US'));

/** 방문자 수. 계기판의 읽음값처럼 라벨과 숫자만 둔다 */
export const VisitorCounter = () => {
  const { data, isLoading } = useVisitor();

  return (
    <dl className='mb-8 grid grid-cols-2 gap-2' aria-label='방문자 통계' aria-busy={isLoading ? 'true' : undefined}>
      {[
        { label: 'Today', value: data?.today },
        { label: 'Total', value: data?.total },
      ].map((item) => (
        <div key={item.label} className='rounded-lg bg-white/[0.045] px-4 py-3'>
          <dt className='text-[12px] text-[#8d98a3]'>{item.label}</dt>
          <dd className='mt-1.5 font-mono text-[22px] leading-none tabular-nums text-[#e9edf1]'>
            {isLoading ? <span className='text-[#8d98a3]'>—</span> : formatNumber(item.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
};
