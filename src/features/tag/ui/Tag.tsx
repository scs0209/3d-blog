import { motion } from 'framer-motion';
import Link from 'next/link';

const colorCombos = [
  'bg-orange-500 border-orange-200',
  'bg-rose-500 border-rose-200',
  'bg-amber-500 border-amber-200',
  'bg-fuchsia-500 border-fuchsia-200',
  'bg-cyan-500 border-cyan-200 dark:bg-cyan-500 dark:border-cyan-200',
  'bg-indigo-500 border-indigo-200 dark:bg-indigo-500 dark:border-indigo-200',
];

const getTagHref = (name: string) => `/blog/all?tags=${encodeURIComponent(name)}`;

export const Tag = ({ tag, count }: { tag: { id?: number; name?: string }; count: number }) => {
  function hashString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  }

  const colorIdx = hashString(tag.name ?? '') % colorCombos.length;
  const colorClass = colorCombos[colorIdx];

  return (
    <motion.span
      key={tag.id}
      whileHover={{ scale: 1.06 }}
      className='relative rounded-lg border border-[#ff9a3c]/25 bg-[#ff9a3c]/8 px-2 py-1 text-xs font-mono shadow-[0_0_10px_rgba(255,154,60,0.1)] transition dark:border-[#3de8ff]/25 dark:bg-[#3de8ff]/8 dark:shadow-[0_0_10px_rgba(61,232,255,0.1)]'
    >
      <Link
        href={getTagHref(tag.name ?? '')}
        className='inline-block px-3 py-1 text-xs font-mono text-[#ffc8a0] backdrop-blur-sm dark:text-[#3de8ff]'
      >
        {tag.name}
        <motion.span
          className={`absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 text-xs text-white ${colorClass}`}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {count}
        </motion.span>
      </Link>
    </motion.span>
  );
};
