import { motion } from 'framer-motion';

// Tailwind 색상 클래스 배열
const colorClasses = [
  'bg-white',
  'bg-blue-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-yellow-400',
  'bg-cyan-400',
  'bg-fuchsia-400',
];
// 별 60개, 색상 랜덤
const stars = Array.from({ length: 100 }).map((_, i) => {
  const color = colorClasses[i % colorClasses.length];
  const size = `${Math.random() * 2 + 1}px`;
  const top = `${Math.random() * 100}%`;
  const left = `${Math.random() * 100}%`;
  const opacity = Math.random() * 0.7 + 0.3;
  const duration = `${2 + Math.random() * 2}s`;
  const delay = `${Math.random() * 2}s`;
  return (
    <span
      key={`star-${Math.random()}`}
      className={`absolute block rounded-full ${color} shadow-[0_0_8px_2px_#7dd3fc88] animate-pulse`}
      style={{
        width: size,
        height: size,
        top,
        left,
        opacity,
        animationDuration: duration,
        animationDelay: delay,
      }}
    />
  );
});

// 행성 생성
const planets = [
  {
    id: 'planet-1',
    size: 80,
    top: '15%',
    left: '85%',
    color: 'from-red-500 to-orange-500',
    ringColor: 'border-yellow-500/20',
    ringSize: 100,
    duration: 120,
  },
  {
    id: 'planet-2',
    size: 40,
    top: '70%',
    left: '10%',
    color: 'from-blue-500 to-purple-500',
    ringColor: 'border-indigo-500/20',
    ringSize: 55,
    duration: 180,
  },
  {
    id: 'planet-3',
    size: 60,
    top: '30%',
    left: '20%',
    color: 'from-green-400 to-blue-400',
    ringColor: 'border-green-300/20',
    ringSize: 80,
    duration: 150,
  },
  {
    id: 'planet-4',
    size: 50,
    top: '60%',
    left: '70%',
    color: 'from-yellow-400 to-pink-400',
    ringColor: 'border-pink-300/20',
    ringSize: 65,
    duration: 100,
  },
  {
    id: 'planet-5',
    size: 35,
    top: '40%',
    left: '55%',
    color: 'from-fuchsia-400 to-purple-500',
    ringColor: 'border-fuchsia-300/20',
    ringSize: 50,
    duration: 90,
  },
];

export const SpaceBackground = () => {
  // 행성/은하수 등 추가
  return (
    <div className='absolute inset-0 z-10 pointer-events-none'>
      {/* 별 */}
      {stars}
      {/* 행성들 */}
      {planets.map((planet) => (
        <motion.div
          key={planet.id}
          className='absolute'
          style={{
            top: planet.top,
            left: planet.left,
          }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: planet.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        >
          {/* 행성 고리 */}
          {planet.ringSize && (
            <div
              className={`absolute rounded-full border-4 ${planet.ringColor}`}
              style={{
                width: planet.ringSize,
                height: planet.ringSize / 2,
                top: planet.size / 2 - planet.ringSize / 4,
                left: planet.size / 2 - planet.ringSize / 2,
                transform: 'rotateX(75deg)',
              }}
            />
          )}

          {/* 행성 본체 */}
          <motion.div
            className={`absolute rounded-full bg-gradient-to-br ${planet.color}`}
            style={{
              width: planet.size,
              height: planet.size,
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: planet.duration * 0.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          >
            {/* 행성 표면 특징 */}
            <div className='absolute w-3/4 h-1/2 bg-white/10 rounded-full top-1/4 left-1/8' />
          </motion.div>
        </motion.div>
      ))}
      {/* 은하수 느낌의 그라데이션 */}
      <div className='absolute inset-0 pointer-events-none -z-10'>
        {/* 여러 개의 큰 은하수 레이어 */}
        {Array.from({ length: 5 }).map((_, i) => {
          // 랜덤 위치, 각도, 색상, 투명도, 크기
          const top = `${40 + Math.random() * 20}%`;
          const left = `${10 + Math.random() * 60}%`;
          const width = `${320 + Math.random() * 160}px`;
          const height = `${24 + Math.random() * 24}px`;
          const rotate = `${-15 + Math.random() * 30}`;
          const opacity = 0.08 + Math.random() * 0.18;
          // Tailwind 지원 색상 조합
          const gradients = [
            'from-blue-200 via-white to-pink-200',
            'from-fuchsia-200 via-white to-blue-200',
            'from-purple-200 via-blue-100 to-pink-100',
            'from-cyan-200 via-white to-fuchsia-200',
            'from-blue-300 via-white to-purple-200',
          ];
          const gradient = gradients[i % gradients.length];
          return (
            <span
              key={`milkyway-${i}-${Math.random()}`}
              className={`absolute rounded-full blur-3xl bg-gradient-to-r ${gradient}`}
              style={{
                top,
                left,
                width,
                height,
                opacity,
                transform: `rotate(${rotate}deg)`,
              }}
            />
          );
        })}
        <div className='absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-purple-500/20 blur-3xl' />
        <div className='absolute bottom-0 right-0 w-1/3 h-1/3 rounded-full bg-pink-500/20 blur-3xl' />
      </div>
    </div>
  );
};
