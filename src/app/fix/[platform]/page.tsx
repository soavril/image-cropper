import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPlatform, isPlatformId, platforms } from '@/lib/platforms';
import { siteConfig } from '@/lib/config';
import { FixPageClient } from './FixPageClient';
import { HowToSchema, FAQSchema, BreadcrumbSchema } from '@/components/seo';

interface PageProps {
  params: Promise<{ platform: string }>;
}

export async function generateStaticParams() {
  return Object.keys(platforms).map((platform) => ({
    platform,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform: platformId } = await params;
  const platform = getPlatform(platformId);

  if (!platform) {
    return { title: '페이지를 찾을 수 없습니다' };
  }

  const title = `${platform.displayName} 사진 업로드 안됨? 3초 해결`;
  const description = `${platform.displayName} 사진 등록 오류, 용량 초과 문제를 즉시 해결하세요. ${platform.dimensions.width}x${platform.dimensions.height}px, ${platform.maxSizeKB}KB 규격에 맞춰 자동 변환. 서버 저장 없이 브라우저에서 바로 처리됩니다.`;

  return {
    title,
    description,
    keywords: [
      ...platform.keywords.error,
      ...platform.keywords.spec,
      '사진 업로드 안됨',
      '사진 용량 줄이기',
      '증명사진 규격',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteConfig.url}/fix/${platform.name}`,
      siteName: siteConfig.name,
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/fix/${platform.name}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function FixPage({ params }: PageProps) {
  const { platform: platformId } = await params;

  if (!isPlatformId(platformId)) {
    notFound();
  }

  const platform = getPlatform(platformId)!;

  const breadcrumbItems = [
    { name: '홈', url: siteConfig.url },
    { name: platform.displayName, url: `${siteConfig.url}/fix/${platform.name}` },
  ];

  return (
    <>
      {/* Structured Data */}
      <HowToSchema platform={platform} />
      <FAQSchema platform={platform} />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Page Content */}
      <FixPageClient platform={platform} />
    </>
  );
}
