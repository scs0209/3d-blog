import {
  Activity,
  Atom,
  Boxes,
  Braces,
  Brush,
  FileCode2,
  FormInput,
  GitBranch,
  Layers,
  Package,
  ShieldAlert,
  Triangle,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export interface SkillItem {
  name: string;
  icon: LucideIcon;
  color?: string;
}

export interface SkillSection {
  title: string;
  items: SkillItem[];
}

export const skillSections: SkillSection[] = [
  {
    title: 'LANGUAGES',
    items: [
      { name: 'TypeScript', icon: FileCode2, color: '#3178C6' },
      { name: 'JavaScript', icon: Braces, color: '#F7DF1E' },
      { name: 'HTML/CSS', icon: Layers, color: '#1572B6' },
    ],
  },
  {
    title: 'FRAMEWORKS',
    items: [
      { name: 'React', icon: Atom, color: '#61DAFB' },
      { name: 'Next.js', icon: Triangle, color: '#000000' },
      { name: 'TanStack Query', icon: Activity, color: '#FF4154' },
      { name: 'TanStack Table', icon: Boxes, color: '#FF4154' },
      { name: 'Zustand', icon: Zap, color: '#443E38' },
      { name: 'React Hook Form', icon: FormInput, color: '#EC5990' },
      { name: 'Zod', icon: ShieldAlert, color: '#3068B7' },
    ],
  },
  {
    title: 'STYLING',
    items: [
      { name: 'Emotion', icon: Brush, color: '#D26AC2' },
      { name: 'Tailwind CSS', icon: Wind, color: '#06B6D4' },
    ],
  },
  {
    title: 'ARCHITECTURE',
    items: [
      { name: 'Monorepo', icon: Package, color: '#E5D6C4' },
      { name: 'FSD', icon: Boxes, color: '#E5D6C4' },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { name: 'Vite', icon: Zap, color: '#646CFF' },
      { name: 'Git', icon: GitBranch, color: '#F05032' },
      { name: 'Sentry', icon: ShieldAlert, color: '#362D59' },
      { name: 'Cursor', icon: FileCode2, color: '#E5D6C4' },
    ],
  },
];
