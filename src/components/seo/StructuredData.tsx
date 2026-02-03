import type { PlatformSpec } from '@/types';
import { siteConfig } from '@/lib/config';

/**
 * HowTo Schema - fix 페이지용
 */
export function HowToSchema({ platform }: { platform: PlatformSpec }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${platform.displayName} 사진 규격 맞추는 방법`,
    description: `${platform.displayName}에 사진이 업로드되지 않을 때 규격에 맞게 변환하는 방법을 안내합니다.`,
    image: `${siteConfig.url}/og-image.png`,
    totalTime: 'PT1M',
    tool: {
      '@type': 'HowToTool',
      name: '사진규격 맞춤',
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: '사진 업로드',
        text: '규격이 맞지 않는 사진을 드래그하거나 클릭하여 업로드합니다.',
        url: `${siteConfig.url}/fix/${platform.name}#upload`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: '규격 검사',
        text: `${platform.displayName} 규격에 맞는지 자동으로 검사합니다. (크기: ${platform.dimensions.width}x${platform.dimensions.height}px, 용량: ${platform.maxSizeKB}KB 이하)`,
        url: `${siteConfig.url}/fix/${platform.name}#check`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: '자동 변환',
        text: '규격에 맞지 않는 항목을 자동으로 변환합니다. (리사이즈, 압축, 비율 조정)',
        url: `${siteConfig.url}/fix/${platform.name}#fix`,
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: '다운로드',
        text: '변환된 사진을 다운로드하여 제출에 사용합니다.',
        url: `${siteConfig.url}/fix/${platform.name}#download`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQPage Schema - guide 페이지용
 */
export function FAQSchema({ platform }: { platform: PlatformSpec }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${platform.displayName} 사진 규격이 어떻게 되나요?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${platform.displayName}의 사진 규격은 ${platform.dimensions.width}x${platform.dimensions.height}px (비율 ${platform.dimensions.ratio}), 최대 ${platform.maxSizeKB}KB입니다. ${platform.formats.map(f => f.toUpperCase()).join(', ')} 형식을 지원합니다.`,
        },
      },
      {
        '@type': 'Question',
        name: `${platform.displayName} 사진 업로드가 안될 때 어떻게 하나요?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `사진 용량이 ${platform.maxSizeKB}KB를 초과하거나 규격(${platform.dimensions.width}x${platform.dimensions.height}px)이 맞지 않을 수 있습니다. 사진규격 맞춤을 사용하면 자동으로 규격에 맞게 변환됩니다.`,
        },
      },
      {
        '@type': 'Question',
        name: '사진이 서버에 저장되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '아니요. 모든 이미지 처리는 사용자의 브라우저에서만 이루어지며, 서버로 전송되거나 저장되지 않습니다. 페이지를 닫으면 즉시 삭제됩니다.',
        },
      },
      {
        '@type': 'Question',
        name: '변환된 사진이 100% 통과되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `본 도구는 ${platform.displayName} 규격에 맞게 사진을 변환하여 통과 가능성을 높여드리지만, 최종 결과는 해당 플랫폼의 심사 기준에 따라 달라질 수 있습니다.`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebApplication Schema - 메인 페이지용
 */
export function WebApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '사진규격 맞춤',
    description: '증명사진 사이즈·용량을 자동으로 변환합니다. 잡코리아, 사람인, 운전면허증 등 플랫폼별 규격에 맞춰 무료로 변환.',
    url: siteConfig.url,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    featureList: [
      '증명사진 규격 자동 검사',
      '자동 리사이즈 및 크롭',
      '파일 용량 압축',
      '브라우저 내 처리 (서버 저장 없음)',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Organization Schema
 */
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    logo: `${siteConfig.url}/logo.png`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * BreadcrumbList Schema
 */
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
