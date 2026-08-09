import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Providers from '@/app/Providers';
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

// SEO 메타데이터
export const metadata: Metadata = {
  title: {
    default: '3D Blog',
    template: '%s | 3D Blog',
  },
  description: '웹 개발 기록을 남기는 블로그이자, Three.js 기반 3D 홈·포트폴리오입니다.',
  keywords: ['블로그', '포트폴리오', '웹 개발', 'React', 'Next.js', 'Three.js', 'React Three Fiber'],
  authors: [{ name: '3D Blog' }],
  creator: '3D Blog',
  publisher: '3D Blog',

  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: baseUrl,
    title: '3D Blog',
    description: '웹 개발 기록과 Three.js로 만든 3D 홈·포트폴리오.',
    siteName: '3D Blog',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: '3D Blog 로고',
        type: 'image/png',
      },
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: '3D Blog 로고',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Blog',
    description: '웹 개발 기록과 Three.js로 만든 3D 홈·포트폴리오.',
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
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
