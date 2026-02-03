import type { Metadata, Viewport } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/lib/config';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563EB',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: '사진규격 맞춤 - 증명사진 사이즈 자동 변환 (무료)',
    template: '%s | 사진규격 맞춤',
  },
  description: siteConfig.description,
  keywords: [
    '증명사진 사이즈',
    '사진 규격 변환',
    '사진 용량 줄이기',
    '증명사진 리사이즈',
    '잡코리아 사진 업로드',
    '사람인 사진 크기',
    '운전면허증 사진 규격',
    '사진 업로드 안됨',
    '이력서 사진 규격',
    '증명사진 KB 줄이기',
  ],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    title: '사진규격 맞춤 - 증명사진 사이즈·용량 무료 변환',
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: '사진규격 맞춤 - 증명사진 규격 자동 변환',
    description: siteConfig.description,
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
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    google: '', // Google Search Console 인증 코드
    // other: {
    //   'naver-site-verification': '네이버 인증 코드',
    // },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Naver Search Advisor 인증 - 배포 후 인증 코드로 교체 */}
        <meta name="naver-site-verification" content="YOUR_NAVER_CODE" />

        {/* 추가 SEO 메타 태그 */}
        <meta name="geo.region" content="KR" />
        <meta name="geo.placename" content="Korea" />
        <meta name="content-language" content="ko" />
      </head>
      <body className="min-h-screen flex flex-col bg-white antialiased">
        {/* Skip to main content - 접근성 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
          본문으로 바로가기
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
