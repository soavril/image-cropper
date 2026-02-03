import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPlatform, isPlatformId, platforms } from '@/lib/platforms';
import { siteConfig } from '@/lib/config';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FAQSchema, BreadcrumbSchema } from '@/components/seo';

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

  const title = `${platform.displayName} 사진 규격 완벽 가이드 2026`;
  const description = `${platform.displayName} 사진 규격: ${platform.dimensions.width}x${platform.dimensions.height}px, ${platform.maxSizeKB}KB 이하, ${platform.formats.map(f => f.toUpperCase()).join('/')} 형식. 업로드 오류 해결 방법과 팁을 확인하세요.`;

  return {
    title,
    description,
    keywords: [
      ...platform.keywords.spec,
      `${platform.displayName} 사진 규격`,
      `${platform.displayName} 사진 크기`,
      `${platform.displayName} 증명사진`,
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteConfig.url}/guide/${platform.name}`,
    },
    alternates: {
      canonical: `${siteConfig.url}/guide/${platform.name}`,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { platform: platformId } = await params;

  if (!isPlatformId(platformId)) {
    notFound();
  }

  const platform = getPlatform(platformId)!;

  const breadcrumbItems = [
    { name: '홈', url: siteConfig.url },
    { name: '가이드', url: `${siteConfig.url}/guide` },
    { name: platform.displayName, url: `${siteConfig.url}/guide/${platform.name}` },
  ];

  // 플랫폼별 추가 FAQ
  const additionalFAQs = getAdditionalFAQs(platform.id);

  return (
    <>
      {/* Structured Data */}
      <FAQSchema platform={platform} />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="text-center mb-8">
          <p className="text-blue-600 font-medium mb-2">2026년 기준</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {platform.displayName} 사진 규격
            <br />
            완벽 가이드
          </h1>
          <p className="text-gray-600">
            업로드 오류 없이 한 번에 통과하는 방법
          </p>
        </section>

        {/* Quick Fix CTA */}
        <Card className="mb-8 bg-blue-50 border-blue-100">
          <div className="text-center">
            <p className="text-blue-800 mb-3">
              사진이 규격에 안 맞나요? 자동으로 맞춰드립니다
            </p>
            <Link href={`/fix/${platform.name}`}>
              <Button size="lg">
                🔧 {platform.displayName} 사진 자동 수정하기
              </Button>
            </Link>
          </div>
        </Card>

        {/* Spec Summary */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 {platform.displayName} 사진 규격 요약
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">권장 크기</p>
              <p className="text-xl font-bold text-gray-900">
                {platform.dimensions.width} × {platform.dimensions.height}
              </p>
              <p className="text-xs text-gray-400">픽셀 (px)</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">최대 용량</p>
              <p className="text-xl font-bold text-gray-900">
                {platform.maxSizeKB}KB
              </p>
              <p className="text-xs text-gray-400">이하</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">비율</p>
              <p className="text-xl font-bold text-gray-900">
                {platform.dimensions.ratio}
              </p>
              <p className="text-xs text-gray-400">가로:세로</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">파일 형식</p>
              <p className="text-xl font-bold text-gray-900">
                {platform.formats.map(f => f.toUpperCase()).join(', ')}
              </p>
              <p className="text-xs text-gray-400">지원 형식</p>
            </div>
          </div>
        </Card>

        {/* Notes */}
        {platform.notes.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ✅ 촬영 시 주의사항
            </h2>
            <ul className="space-y-3">
              {platform.notes.map((note, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-600">{note}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Common Errors */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ⚠️ 흔한 업로드 오류 원인
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">❌</span>
              <div>
                <h3 className="font-medium text-gray-900">파일 용량 초과</h3>
                <p className="text-sm text-gray-600">
                  스마트폰으로 찍은 사진은 보통 2~5MB입니다. {platform.maxSizeKB}KB
                  이하로 압축이 필요합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">❌</span>
              <div>
                <h3 className="font-medium text-gray-900">비율 불일치</h3>
                <p className="text-sm text-gray-600">
                  일반 사진(4:3, 16:9)을 그대로 업로드하면 거절됩니다.
                  {platform.dimensions.ratio} 비율로 크롭이 필요합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">❌</span>
              <div>
                <h3 className="font-medium text-gray-900">지원하지 않는 형식</h3>
                <p className="text-sm text-gray-600">
                  아이폰의 HEIC, 웹용 WEBP 형식은 지원되지 않습니다.
                  {platform.formats.map(f => f.toUpperCase()).join(' 또는 ')}로 변환하세요.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* FAQ */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            💬 자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Q. {platform.displayName} 사진 규격이 정확히 어떻게 되나요?
              </h3>
              <p className="text-gray-600 text-sm">
                {platform.displayName}의 사진 규격은 {platform.dimensions.width}×
                {platform.dimensions.height}px (비율 {platform.dimensions.ratio}),
                최대 {platform.maxSizeKB}KB입니다.
                {platform.formats.map(f => f.toUpperCase()).join(', ')} 형식을
                지원합니다.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Q. 스마트폰으로 찍은 사진을 사용해도 되나요?
              </h3>
              <p className="text-gray-600 text-sm">
                네, 스마트폰 사진도 사용 가능합니다. 다만 용량이 크고 비율이 맞지
                않아 조정이 필요합니다. 제출사진 해결사를 사용하면 자동으로
                규격에 맞게 변환됩니다.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Q. 사진관에서 찍은 사진을 스캔해서 사용해도 되나요?
              </h3>
              <p className="text-gray-600 text-sm">
                네, 스캔한 사진도 사용 가능합니다. 스캔 시 해상도를 300dpi
                이상으로 설정하고, 규격에 맞게 크롭하면 됩니다.
              </p>
            </div>
            {additionalFAQs.map((faq, i) => (
              <div key={i} className={i < additionalFAQs.length - 1 ? 'border-b border-gray-100 pb-4' : ''}>
                <h3 className="font-medium text-gray-900 mb-2">
                  Q. {faq.question}
                </h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            사진 규격 맞추기 번거로우시죠?
          </p>
          <Link href={`/fix/${platform.name}`}>
            <Button size="lg" className="w-full sm:w-auto">
              🔧 자동으로 규격 맞추기
            </Button>
          </Link>
        </div>

        {/* Related Platforms */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📌 다른 플랫폼 가이드
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(platforms)
              .filter((p) => p.id !== platform.id)
              .map((p) => (
                <Link
                  key={p.id}
                  href={`/guide/${p.name}`}
                  className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-center transition-colors"
                >
                  <span className="text-xl">
                    {p.id === 'jobkorea' && '💼'}
                    {p.id === 'saramin' && '👔'}
                    {p.id === 'drivers-license' && '🚗'}
                    {p.id === 'id-card' && '🪪'}
                  </span>
                  <p className="text-sm font-medium mt-1">{p.displayName}</p>
                  <p className="text-xs text-gray-500">
                    {p.dimensions.width}×{p.dimensions.height}px
                  </p>
                </Link>
              ))}
          </div>
        </Card>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-sm text-amber-800">
            <strong>안내:</strong> 본 정보는 2026년 기준 추정치이며, 실제 규격은
            변경될 수 있습니다. 정확한 규격은 {platform.displayName} 공식
            안내를 참고하세요.
          </p>
        </div>
      </div>
    </>
  );
}

// 플랫폼별 추가 FAQ
function getAdditionalFAQs(platformId: string): Array<{ question: string; answer: string }> {
  const faqs: Record<string, Array<{ question: string; answer: string }>> = {
    jobkorea: [
      {
        question: '잡코리아 이력서 사진은 언제 찍은 걸 써야 하나요?',
        answer: '최근 6개월 이내에 촬영한 사진을 권장합니다. 너무 오래된 사진은 면접 시 인상이 달라 보일 수 있습니다.',
      },
      {
        question: '잡코리아에서 셀카를 사용해도 되나요?',
        answer: '공식적으로 금지하지는 않지만, 증명사진 형태의 정면 사진을 권장합니다. 채용 담당자에게 좋은 인상을 주기 위해 단정한 증명사진을 사용하세요.',
      },
    ],
    saramin: [
      {
        question: '사람인과 잡코리아 사진 규격이 같나요?',
        answer: '네, 두 플랫폼 모두 비슷한 규격(400×500px 내외, 500KB 이하)을 사용합니다. 한 번 맞춰두면 두 곳 모두 사용 가능합니다.',
      },
      {
        question: '사람인 이력서 사진에 정장을 입어야 하나요?',
        answer: '지원하는 업종에 따라 다릅니다. 일반 기업은 단정한 셔츠나 정장, 크리에이티브 업종은 깔끔한 캐주얼도 무방합니다.',
      },
    ],
    'drivers-license': [
      {
        question: '운전면허증 사진에 안경을 쓰고 찍어도 되나요?',
        answer: '네, 안경 착용 가능합니다. 단, 색안경이나 선글라스는 불가하며, 안경 렌즈에 빛 반사가 없어야 합니다.',
      },
      {
        question: '운전면허증 사진 배경색은 어떤 색이어야 하나요?',
        answer: '흰색 또는 밝은 단색 배경이어야 합니다. 무늬가 있거나 어두운 배경은 거절될 수 있습니다.',
      },
    ],
    'id-card': [
      {
        question: '주민등록증 사진과 여권 사진 규격이 같나요?',
        answer: '비슷하지만 정확히 같지는 않습니다. 여권은 35×45mm, 주민등록증은 3×4cm 규격입니다. 제출처에 맞는 규격을 확인하세요.',
      },
      {
        question: '신분증 사진에 화장을 해도 되나요?',
        answer: '자연스러운 화장은 괜찮습니다. 단, 본인 확인이 어려울 정도의 진한 화장은 피하세요.',
      },
    ],
  };

  return faqs[platformId] || [];
}
