import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import './Prosemirror.css';
import ThemeToggleButton from '@/shared/ui/ThemeToggleButton';
import Providers from '@/app/Providers';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { baseUrl } from '@/shared/consts/baseUrl';

const VisitorLogger = dynamic(() => import('@/shared/ui/VisitorLogger'));

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// SEO 최적화를 위한 메타데이터
export const metadata: Metadata = {
  title: {
    default: '3D 블로그 - 개발자의 사이버펑크 공간',
    template: '%s | 3D 블로그',
  },
  description: 'React Three Fiber로 구현된 3D 인터랙티브 블로그 겸 포트폴리오.',
  keywords: ['3D 블로그', 'React Three Fiber', 'Three.js', '개발', '프로그래밍', '사이버펑크', '인터랙티브'],
  authors: [{ name: '3D 블로그 개발자' }],
  creator: 'Ayaan',
  publisher: 'Ayaan Company',

  metadataBase: new URL(baseUrl || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: baseUrl,
    title: '3D 블로그 - 개발자의 사이버펑크 공간',
    description:
      'React Three Fiber로 구현된 3D 인터랙티브 블로그. 개발, 기술, 창작에 대한 이야기를 3D 공간에서 경험해보세요.',
    siteName: '3D 블로그',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: '3D 블로그 로고',
        type: 'image/png',
      },
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: '3D 블로그 로고 (정사각형)',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D 블로그 - 개발자의 사이버펑크 공간',
    description: 'React Three Fiber로 구현된 3D 인터랙티브 블로그',
    images: ['/logo.png', '/logo-square.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <Providers>
            <VisitorLogger />
            {children}
            <ThemeToggleButton />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
