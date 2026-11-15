import Link from 'next/link';

/** 없는 주소: 다른 화면과 같은 바탕과 글씨로, 갈 곳 두 군데만 알려 준다 */
export default function NotFound() {
  return (
    <main className='flex min-h-dvh flex-col bg-[#050608] px-5 text-[#c3ccd4] md:px-12'>
      <header className='flex h-16 items-center'>
        <Link
          href='/'
          className='font-[family-name:var(--font-syne),sans-serif] text-[15px] font-bold tracking-[0.04em] text-[#e9edf1]'
        >
          AYAAN
        </Link>
      </header>
      <div className='flex flex-1 flex-col justify-center pb-24'>
        <p className='text-[15px] text-[#8d98a3]'>404</p>
        <h1 className='mt-3 break-keep font-[family-name:var(--font-syne),sans-serif] text-[clamp(2.6rem,9vw,6rem)] font-bold leading-[0.95] tracking-[-0.02em] text-[#e9edf1]'>
          페이지를 찾을 수 없습니다
        </h1>
        <p className='mt-6 max-w-md text-[15px] leading-relaxed'>주소가 바뀌었거나 없는 페이지입니다.</p>
        <div className='mt-10 flex flex-wrap gap-3'>
          <Link
            href='/'
            className='rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-[#050608] transition-colors hover:bg-[#4de3ff]'
          >
            포트폴리오로
          </Link>
          <Link
            href='/blog'
            className='rounded-full bg-white/[0.08] px-6 py-3 text-[15px] font-semibold text-[#e9edf1] transition-colors hover:bg-white/[0.14]'
          >
            블로그로
          </Link>
        </div>
      </div>
    </main>
  );
}
