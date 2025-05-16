import { motion } from 'framer-motion';
import Link from 'next/link';

export const Tag = ({ tag }: { tag: { id: string; name: string; count: number } }) => {
  const colorCombos = [
    'bg-blue-500 border-blue-200',
    'bg-pink-500 border-pink-200',
    'bg-green-500 border-green-200',
    'bg-yellow-500 border-yellow-200',
    'bg-purple-500 border-purple-200',
    'bg-cyan-500 border-cyan-200',
    'bg-fuchsia-500 border-fuchsia-200',
    'bg-orange-500 border-orange-200',
    'bg-sky-500 border-sky-200',
    'bg-rose-500 border-rose-200',
  ];

  // 태그 이름을 해시로 변환해서 색상 인덱스 결정
  function hashString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  }

  const colorIdx = hashString(tag.name) % colorCombos.length;
  const colorClass = colorCombos[colorIdx];

  return (
    <motion.span
      key={tag.id}
      whileHover={{ scale: 1.08, boxShadow: '0 0 8px #7dd3fc, 0 0 16px #7dd3fc55' }}
      className='bg-blue-900/40 px-2 py-1 rounded-lg text-xs font-mono border border-blue-300 shadow-[0_0_8px_#7dd3fc55] transition relative'
    >
      <Link
        href={`/tag/${tag.name}`}
        className='inline-block px-3 py-1 back drop-blur-sm text-blue-100 text-xs font-mono'
      >
        {tag.name}
        <motion.span
          className={`absolute -top-1 -right-1 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full border-2 ${colorClass}`}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {tag.count}
        </motion.span>
      </Link>
    </motion.span>
  );
};
