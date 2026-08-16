import type { Metadata } from 'next';
import { PortfolioView } from '@/views/portfolio';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: '3D desk and desktop OS portfolio',
  openGraph: {
    title: 'Portfolio',
    description: '3D desk and desktop OS portfolio',
  },
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
