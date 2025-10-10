import {
  FileCode2,
  Braces,
  Database,
  CloudCog,
  Flame,
  Activity,
  Workflow,
  Atom,
  Triangle,
  Server,
  ShoppingBag,
  CreditCard,
  Mail,
  FileText,
  Facebook,
  Music,
  BarChart3,
  MessageCircle,
  Brush,
  Zap,
  GitBranch,
  Layers,
  Smartphone,
  Figma,
  Droplet,
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
      { name: 'HTML5', icon: FileCode2, color: '#E34F26' },
      { name: 'CSS3', icon: Layers, color: '#1572B6' },
      { name: 'JavaScript', icon: Braces, color: '#F7DF1E' },
      { name: 'TypeScript', icon: FileCode2, color: '#3178C6' },
      { name: 'Liquid', icon: Droplet, color: '#7AB55C' },
    ],
  },
  {
    title: 'DATABASES',
    items: [
      { name: 'Hasura', icon: Activity, color: '#1EB4D4' },
      { name: 'Firebase', icon: Flame, color: '#FFCA28' },
      { name: 'MySQL', icon: Database, color: '#4479A1' },
      { name: 'CleverCloud', icon: CloudCog, color: '#F39C12' },
      { name: 'Meteor', icon: Activity, color: '#DE4F4F' },
    ],
  },
  {
    title: 'FRAMEWORKS',
    items: [
      { name: 'Next.js', icon: Triangle, color: '#000000' },
      { name: 'React', icon: Atom, color: '#61DAFB' },
      { name: 'Express', icon: Server, color: '#000000' },
      { name: 'Django', icon: Workflow, color: '#092E20' },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { name: 'AWS', icon: CloudCog, color: '#FF9900' },
      { name: 'Git', icon: GitBranch, color: '#F05032' },
      { name: 'Prisma', icon: Database, color: '#2D3748' },
      { name: 'Xcode', icon: Smartphone, color: '#1575F9' },
      { name: 'Figma', icon: Figma, color: '#F24E1E' },
    ],
  },
  {
    title: 'APIS',
    items: [
      { name: 'Shopify', icon: ShoppingBag, color: '#7AB55C' },
      { name: 'Stripe', icon: CreditCard, color: '#635BFF' },
      { name: 'Klaviyo', icon: Mail, color: '#FF6900' },
      { name: 'Notion', icon: FileText, color: '#000000' },
      { name: 'Facebook', icon: Facebook, color: '#1877F2' },
      { name: 'TikTok', icon: Music, color: '#FF0050' },
      { name: 'Analytics', icon: BarChart3, color: '#E37400' },
      { name: 'Discord', icon: MessageCircle, color: '#5865F2' },
      { name: 'Adobe', icon: Brush, color: '#FF0000' },
      { name: 'Velo', icon: Zap, color: '#0C6EFC' },
    ],
  },
];
