'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { experiences } from '@/entities/portfolio/model/constants/experienceConstants';
import { useViewportProfile } from '@/shared/hooks/use-viewport-profile';
import { aboutMeData, portfolioProjects, skillSections } from '@/widgets/portfolio/consts';
import type { Shot, World } from './ChipCanvas';
import { ability, DISTRICT_IDS, DISTRICTS, type DistrictId, type ViewId } from './district';

const ChipCanvas = dynamic(() => import('./ChipCanvas').then((mod) => mod.ChipCanvas), { ssr: false });

/** 방문할 때마다 조명 색이 바뀌고, 직접 고를 수도 있다 */
const ACCENTS = ['#4de3ff', '#9d8cff', '#5cf0b6', '#ff7ab6'] as const;
const BOOT_KEY = 'ayaan-portfolio-boot';
const BITS_KEY = 'ayaan-portfolio-bits';
/** 이동 키. 한글 입력 상태에서도 되도록 글자가 아니라 자판 위치로 받는다 */
const WALK_CODES = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
/** 도시에 숨겨진 비트의 개수 (Citizens의 BIT_COUNT와 같다) */
const BIT_TOTAL = 8;

const DISPLAY: CSSProperties = { fontFamily: 'var(--font-syne), sans-serif' };

const STYLES = `
  @keyframes chip-rise { from { opacity: 0; transform: translate3d(0, 26px, 0); } to { opacity: 1; transform: none; } }
  @keyframes chip-pulse { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }
  .chip-rise { animation: chip-rise 900ms cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: calc(var(--d, 0) * 110ms + 900ms); }
  .chip-pulse { animation: chip-pulse 2.2s ease-in-out infinite; }
  .chip-dock { scrollbar-width: none; }
  .chip-dock::-webkit-scrollbar { display: none; }
  @media (prefers-reduced-motion: reduce) {
    .chip-rise, .chip-pulse { animation: none; }
  }
`;

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReduced(query.matches);
    handleChange();
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);
  return reduced;
};

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]';

/**
 * 포트폴리오: 보드 위의 칩 하나에서 시작해 그 안으로 들어간다.
 * 칩 안은 다이 위에 세워진 도시이고, 소개·경력·프로젝트·기술·연락이 각각 하나의 지구다.
 * 내용은 모두 3D 공간 안에 있고, 화면 위에는 이동을 돕는 조작만 얹는다.
 */
export const ChipPortfolio = () => {
  const { isMobile } = useViewportProfile();
  const still = usePrefersReducedMotion();
  const [world, setWorld] = useState<World>('board');
  const [shot, setShot] = useState<Shot>({ kind: 'board' });
  const [veil, setVeil] = useState(false);
  const [busy, setBusy] = useState(false);
  const [boot, setBoot] = useState<number | null>(null);
  const [accentIndex, setAccentIndex] = useState(0);
  const timers = useRef<number[]>([]);
  /** 걷기 화면의 시야 거리: 0 가까이, 1 보통, 2 멀리 */
  const [zoom, setZoom] = useState(0);
  /** 내 캐릭터가 가까이 다가간 지구 */
  const [near, setNear] = useState<DistrictId | null>(null);
  /** 지금까지 모은 비트. 다음 방문에도 남는다 */
  const [bits, setBits] = useState<number[]>([]);
  /** 방금 마지막 조각을 주웠을 때만 잠깐 뜨는 알림 */
  const [restored, setRestored] = useState(false);
  const picked = useRef(false);

  // 방문 횟수: 이 브라우저에서 몇 번째 부팅인지 세고, 그에 따라 조명 색을 고른다
  useEffect(() => {
    let count = 1;
    try {
      count = Number(window.localStorage.getItem(BOOT_KEY) ?? '0') + 1;
      window.localStorage.setItem(BOOT_KEY, String(count));
    } catch {
      // 저장소를 못 쓰는 환경에서는 첫 방문으로 취급한다
    }
    const safe = Number.isFinite(count) && count > 0 ? count : 1;
    setBoot(safe);
    setAccentIndex((safe - 1) % ACCENTS.length);
  }, []);

  useEffect(
    () => () => {
      for (const timer of timers.current) {
        window.clearTimeout(timer);
      }
      document.body.style.cursor = '';
    },
    [],
  );

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(window.localStorage.getItem(BITS_KEY) ?? '[]');
      if (Array.isArray(saved)) {
        setBits(saved.filter((item): item is number => Number.isInteger(item) && item >= 0 && item < BIT_TOTAL));
      }
    } catch {
      // 저장된 기록을 못 읽으면 처음부터 모은다
    }
  }, []);

  const handleCollect = useCallback((index: number) => {
    picked.current = true;
    setBits((current) => {
      if (current.includes(index)) {
        return current;
      }
      const next = [...current, index];
      try {
        window.localStorage.setItem(BITS_KEY, JSON.stringify(next));
      } catch {
        // 저장하지 못해도 이번 방문 동안은 유지된다
      }
      return next;
    });
  }, []);

  const complete = bits.length === BIT_TOTAL;

  // 다 모으면 보상으로 연속 점프가 열린다. 저장된 기록으로 다시 와도 유지된다
  useEffect(() => {
    ability.flight = complete;
    if (!complete || !picked.current) {
      return;
    }
    picked.current = false;
    setRestored(true);
    const timer = window.setTimeout(() => setRestored(false), 6500);
    return () => window.clearTimeout(timer);
  }, [complete]);

  const handleScatter = useCallback(() => {
    picked.current = false;
    setRestored(false);
    setBits([]);
    try {
      window.localStorage.removeItem(BITS_KEY);
    } catch {
      // 저장소를 못 써도 이번 방문에서는 다시 모을 수 있다
    }
  }, []);

  const accent = ACCENTS[accentIndex] ?? ACCENTS[0];
  const view: ViewId | 'walk' = shot.kind === 'board' || shot.kind === 'dive' ? 'overview' : shot.kind;
  const walking = world === 'die' && shot.kind === 'walk';
  const inside = world === 'die';

  const later = useCallback((callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  }, []);

  /** 칩 안으로: 카메라가 뚜껑으로 내려가고, 화면이 잠깐 덮인 사이 세계가 바뀐다 */
  const handleEnter = useCallback(() => {
    if (busy || world !== 'board') {
      return;
    }
    setBusy(true);
    document.body.style.cursor = '';
    setShot({ kind: 'dive' });
    later(() => setVeil(true), still ? 0 : 850);
    later(
      () => {
        setWorld('die');
        setShot({ kind: 'walk', from: 'sky' });
      },
      still ? 80 : 1500,
    );
    later(
      () => {
        setVeil(false);
        setBusy(false);
      },
      still ? 160 : 1750,
    );
  }, [busy, world, still, later]);

  /** 칩 밖으로 */
  const handleExit = useCallback(() => {
    if (busy || world !== 'die') {
      return;
    }
    setBusy(true);
    document.body.style.cursor = '';
    setVeil(true);
    later(() => {
      setWorld('board');
      setShot({ kind: 'board', from: 'lid' });
    }, 520);
    later(() => {
      setVeil(false);
      setBusy(false);
    }, 760);
  }, [busy, world, later]);

  const handleSelect = useCallback(
    (id: ViewId | 'walk') => {
      if (busy || world !== 'die') {
        return;
      }
      setShot({ kind: id });
    },
    [busy, world],
  );

  // 키보드: Enter로 들어가고, 1–5로 지구 이동, 좌우로 순회, Esc로 한 단계 물러난다
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('input, textarea, select')) {
        return;
      }
      if (world === 'board') {
        if (event.key === 'Enter' && !(event.target instanceof Element && event.target.closest('a, button'))) {
          handleEnter();
        }
        return;
      }
      const number = Number(event.key);
      if (Number.isInteger(number) && number >= 1 && number <= DISTRICT_IDS.length) {
        const id = DISTRICT_IDS[number - 1];
        if (id) {
          handleSelect(id);
        }
        return;
      }
      if (event.key === '0') {
        handleSelect('overview');
      } else if (event.key === 'Escape') {
        if (walking) {
          handleExit();
        } else {
          handleSelect('walk');
        }
      } else if (walking) {
        // 걷는 중: 지구 앞에서 E·Enter로 올라온 패널을 가까이서 본다. Space는 점프다 (방향키는 이동에 쓴다)
        const onButton = event.target instanceof Element && event.target.closest('a, button');
        if (near && !onButton && (event.code === 'KeyE' || event.key === 'Enter')) {
          event.preventDefault();
          handleSelect(near);
        }
      } else if (WALK_CODES.has(event.code)) {
        // 기억을 보고 있거나 전체를 보는 중에 이동 키를 누르면, 바로 걷기로 돌아가 그 방향으로 걷는다
        event.preventDefault();
        handleSelect('walk');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [world, walking, near, handleEnter, handleExit, handleSelect]);

  const bio = aboutMeData.sections[0];
  const current = DISTRICTS.find((district) => district.id === view);

  return (
    <div
      className='relative h-dvh w-full overflow-hidden bg-[#050608] text-[#e9edf1]'
      style={{ '--accent': accent } as CSSProperties}
    >
      <style>{STYLES}</style>

      {boot !== null ? (
        <ChipCanvas
          world={world}
          shot={shot}
          accent={accent}
          still={still}
          compact={isMobile}
          onEnter={handleEnter}
          onSelect={handleSelect}
          onNear={setNear}
          collected={bits}
          onCollect={handleCollect}
          zoom={zoom}
        />
      ) : null}

      {/* 세계가 바뀌는 순간을 덮는 막 */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 transition-opacity ease-out ${veil ? 'opacity-100 duration-500' : 'opacity-0 duration-700'}`}
        style={{ background: `radial-gradient(circle at 50% 50%, ${accent} 0%, #0a0d12 38%, #050608 70%)` }}
        aria-hidden
      />

      {/* 상단 */}
      <header className='pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-5 py-5 md:px-10'>
        <div>
          <p className='text-[15px] font-semibold tracking-[0.02em] text-white' style={DISPLAY}>
            {aboutMeData.name}
          </p>
          <p className='mt-1 text-[12px] text-[#8d98a3]'>
            {inside ? (
              <>
                memory <span className='text-[var(--accent)]'>/</span>{' '}
                {current ? current.file : walking ? '걸어서 둘러보는 중' : '전체 기억'}
              </>
            ) : (
              `${aboutMeData.title} · AI MEMORY`
            )}
          </p>
        </div>
        <div className='pointer-events-auto flex items-center gap-2'>
          {[{ href: '/blog', label: 'Blog' }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full bg-white/[0.08] px-3.5 py-1.5 text-[13px] text-[#dfe5ea] transition-colors hover:bg-white/[0.16] hover:text-white ${FOCUS}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>

      {/* 칩 바깥: 이름과 들어가는 문 */}
      {inside ? null : (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 px-5 pb-8 transition-opacity duration-500 md:px-10 md:pb-12 ${busy ? 'opacity-0' : 'opacity-100'}`}
        >
          <div
            className='absolute inset-x-0 bottom-0 -z-10 h-[150%]'
            style={{ background: 'linear-gradient(0deg, rgba(5,6,8,0.9) 0%, rgba(5,6,8,0.5) 55%, rgba(5,6,8,0) 100%)' }}
            aria-hidden
          />
          <h1
            className='chip-rise text-[clamp(68px,15vw,220px)] leading-[0.82] font-bold tracking-[-0.05em] text-white'
            style={DISPLAY}
          >
            {aboutMeData.name}
          </h1>
          <div
            className='chip-rise mt-6 flex flex-wrap items-end justify-between gap-6'
            style={{ '--d': 1 } as CSSProperties}
          >
            <p className='max-w-[440px] text-[15px] leading-[1.7] text-[#c9d1d8] md:text-[16px]'>
              {bio?.paragraphs[2]}
            </p>
            <div className='flex flex-col items-start gap-3 md:items-end'>
              <button
                type='button'
                onClick={handleEnter}
                className={`pointer-events-auto group relative flex items-center gap-5 rounded-full bg-white py-3.5 pr-3.5 pl-8 text-[17px] font-semibold text-[#050608] transition-transform hover:scale-[1.03] active:scale-[0.98] md:py-4 md:pr-4 md:pl-9 md:text-[19px] ${FOCUS}`}
              >
                {/* 가장 중요한 행동이라, 강조색 테두리가 천천히 깜빡이며 눈에 띄게 한다 */}
                <span
                  className='chip-pulse pointer-events-none absolute -inset-1.5 rounded-full border border-[var(--accent)]'
                  aria-hidden
                />
                메모리 열어 보기
                <span className='grid h-10 w-10 place-items-center rounded-full bg-[#050608] text-[18px] text-[var(--accent)] transition-transform group-hover:translate-y-0.5 md:h-11 md:w-11'>
                  ↓
                </span>
              </button>
              <p className='chip-pulse text-[12px] text-[#8d98a3]'>
                AYAAN에 대한 기억이 이 칩에 담겨 있습니다 · 칩을 눌러도 열립니다
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 칩 안: 지구 이동 독 */}
      {inside ? (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-3 px-3 pb-5 transition-opacity duration-700 md:pb-7 ${busy ? 'opacity-0' : 'opacity-100'}`}
        >
          {walking && near ? (
            <button
              type='button'
              onClick={() => handleSelect(near)}
              className={`pointer-events-auto flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-5 text-[13px] font-semibold text-[#050608] transition-transform hover:scale-[1.03] ${FOCUS}`}
            >
              {DISTRICTS.find((district) => district.id === near)?.label} 기억 불러오기
              {/* 키보드가 없는 화면에서는 화살표로 바꿔 보여 준다 */}
              <span className='grid h-7 min-w-7 place-items-center rounded-full bg-[#050608] px-2 font-mono text-[11px] text-[var(--accent)]'>
                {isMobile ? '↑' : 'E'}
              </span>
            </button>
          ) : null}
          {restored ? (
            <div className='rounded-2xl bg-[#e2b85c] px-5 py-3 text-center text-[#050608]' role='status'>
              <p className='text-[15px] font-semibold'>기억 복원 완료</p>
              <p className='mt-0.5 text-[12px]'>조각 {BIT_TOTAL}개를 모두 모았습니다 · 보상: 공중에서 계속 점프</p>
            </div>
          ) : null}
          <p className='text-[12px] text-[#e2b85c]' aria-live='polite'>
            ◆ 기억 조각 {bits.length}/{BIT_TOTAL}
            {complete ? ' · 연속 점프 해금' : walking && !isMobile ? ' · 도시에 흩어진 금빛 조각을 찾아보세요' : ''}
            {complete ? (
              <button
                type='button'
                onClick={handleScatter}
                className={`pointer-events-auto ml-2 rounded-full bg-[#0d1116]/90 px-2.5 py-1 text-[#c9d1d8] hover:text-white ${FOCUS}`}
              >
                다시 흩어 놓기
              </button>
            ) : null}
          </p>
          <p className='text-center text-[12px] text-[#8d98a3]'>
            {walking
              ? isMobile
                ? '바닥을 눌러 걷기 · 점프 버튼으로 건물 넘기'
                : `WASD · 방향키로 걷기 · Space 점프(공중에서 ${complete ? '계속' : '한 번 더'}) · 드래그로 시점 회전`
              : isMobile
                ? '드래그 회전 · 건물과 이름표를 눌러 이동'
                : '드래그 회전 · 휠 확대 · 이동 키를 누르면 다시 걷기'}
          </p>
          {/* 걷는 동안의 시야 거리: 처음에는 가까이서 시작하고, 원하면 물러날 수 있다 */}
          {walking ? (
            <fieldset
              className='pointer-events-auto flex min-w-0 items-center gap-1 rounded-full bg-[#0d1116]/90 p-1'
              aria-label='시야 거리'
            >
              <span className='px-2.5 text-[12px] text-[#8d98a3]'>시야</span>
              {['가까이', '보통', '멀리'].map((label, index) => (
                <button
                  key={label}
                  type='button'
                  onClick={() => setZoom(index)}
                  aria-pressed={zoom === index}
                  className={`rounded-full px-3 py-1.5 text-[12px] transition-colors ${FOCUS} ${
                    zoom === index ? 'bg-white text-[#050608]' : 'text-[#c9d1d8] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
              {/* 터치 화면용 점프. 키보드에서는 Space */}
              <button
                type='button'
                onClick={() => window.dispatchEvent(new Event('portfolio:jump'))}
                className={`ml-1 rounded-full bg-[var(--accent)] px-3.5 py-1.5 text-[12px] font-semibold text-[#050608] transition-transform active:scale-95 ${FOCUS}`}
              >
                점프
              </button>
            </fieldset>
          ) : null}
          {/* 좁은 화면에서는 두 줄(이동 방식 / 다섯 지구)로 나눠 한 화면에 모두 보이게 한다 */}
          <nav
            aria-label='지구 이동'
            className='chip-dock pointer-events-auto flex w-full max-w-[26rem] flex-col gap-1 rounded-2xl bg-[#0d1116]/90 p-1.5 md:w-auto md:max-w-full md:flex-row md:items-center md:rounded-full'
          >
            <div className='flex items-center gap-1'>
              <button
                type='button'
                onClick={handleExit}
                className={`flex-1 whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] text-[#8d98a3] transition-colors hover:text-white md:flex-none ${FOCUS}`}
              >
                ← 칩 밖으로
              </button>
              <button
                type='button'
                onClick={() => handleSelect('walk')}
                aria-current={view === 'walk' ? 'true' : undefined}
                className={`flex-1 whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] transition-colors md:flex-none ${FOCUS} ${
                  view === 'walk' ? 'bg-white text-[#050608]' : 'text-[#c9d1d8] hover:text-white'
                }`}
              >
                걷기
              </button>
              <button
                type='button'
                onClick={() => handleSelect('overview')}
                aria-current={view === 'overview' ? 'true' : undefined}
                className={`flex-1 whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] transition-colors md:flex-none ${FOCUS} ${
                  view === 'overview' ? 'bg-white text-[#050608]' : 'text-[#c9d1d8] hover:text-white'
                }`}
              >
                전체
              </button>
            </div>
            <div className='grid grid-cols-5 gap-1 md:flex md:items-center'>
              {DISTRICTS.map((district) => (
                <button
                  key={district.id}
                  type='button'
                  onClick={() => handleSelect(district.id)}
                  aria-current={view === district.id ? 'true' : undefined}
                  className={`flex min-w-0 flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[10px] transition-colors md:flex-row md:gap-2 md:rounded-full md:px-3.5 md:py-2 md:text-[12px] ${FOCUS} ${
                    view === district.id ? 'bg-white text-[#050608]' : 'text-[#c9d1d8] hover:text-white'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] ${view === district.id ? 'text-[#050608]/60' : 'text-[var(--accent)]'}`}
                  >
                    {district.code}
                  </span>
                  <span className='max-w-full truncate'>
                    {district.label.charAt(0) + district.label.slice(1).toLowerCase()}
                  </span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      ) : null}

      {/* 조명 색과 방문 횟수 */}
      <div className='pointer-events-none absolute top-1/2 right-4 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex'>
        {ACCENTS.map((color, index) => (
          <button
            key={color}
            type='button'
            onClick={() => setAccentIndex(index)}
            aria-label={`조명 색 ${index + 1}`}
            aria-pressed={accentIndex === index}
            className={`pointer-events-auto h-3 w-3 rounded-full transition-transform hover:scale-125 ${FOCUS} ${
              accentIndex === index
                ? 'scale-125 ring-2 ring-white/70 ring-offset-2 ring-offset-[#050608]'
                : 'opacity-70'
            }`}
            style={{ background: color }}
          />
        ))}
        {boot !== null ? (
          <p className='mt-2 text-[11px] text-[#8d98a3] [writing-mode:vertical-rl]'>
            BOOT <span className='text-[var(--accent)]'>#{String(boot).padStart(3, '0')}</span>
          </p>
        ) : null}
      </div>

      {/* 화면 낭독기와 검색 엔진을 위한 같은 내용 */}
      <div className='sr-only'>
        <h2>About</h2>
        {bio?.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <h2>Experience</h2>
        {experiences.map((item) => (
          <section key={item.id}>
            <h3>
              {item.company} — {item.role} ({item.period})
            </h3>
            <ul>
              {item.description.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
        <h2>Projects</h2>
        {portfolioProjects.map((project) => (
          <section key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.liveUrl ? <a href={project.liveUrl}>사이트 보기</a> : null}
            {project.sourceUrl ? <a href={project.sourceUrl}>소스 보기</a> : null}
          </section>
        ))}
        <h2>Skills</h2>
        <ul>
          {skillSections.map((section) => (
            <li key={section.title}>
              {section.title}: {section.items.map((item) => item.name).join(', ')}
            </li>
          ))}
        </ul>
        <h2>Contact</h2>
        <ul>
          {aboutMeData.socials.map((social) => (
            <li key={social.type}>
              <a href={social.url}>{social.type}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
