import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPlatform, isPlatformId, platforms, OFFICIAL_STANDARDS } from '@/lib/platforms';
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

  // SEO 최적화된 타이틀
  const title = `${platform.displayName} 사진 업로드 안됨? 규격 가이드 2026`;
  const description = `${platform.displayName} 사진 업로드 오류 해결 가이드. 권장 규격: ${platform.dimensions.width}x${platform.dimensions.height}px. 용량 초과, 비율 불일치 문제를 자동으로 조정합니다.`;

  return {
    title,
    description,
    keywords: [
      ...platform.keywords.spec,
      ...platform.keywords.error,
      `${platform.displayName} 사진 규격`,
      `${platform.displayName} 사진 크기`,
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

  // 공식 규격 여부에 따른 표현
  const specLabel = platform.source.isEstimate ? '권장 규격' : '공식 규격';

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
            {platform.displayName} 사진 업로드 안됨?
            <br />
            <span className="text-blue-600">규격 가이드 & 해결 방법</span>
          </h1>
          <p className="text-gray-600">
            업로드 실패 원인과 해결 방법을 알아보세요
          </p>
        </section>

        {/* Quick Fix CTA */}
        <Card className="mb-8 bg-blue-50 border-blue-100">
          <div className="text-center">
            <p className="text-blue-800 mb-3">
              사진이 규격에 안 맞나요? 자동으로 조정해드립니다
            </p>
            <Link href={`/fix/${platform.name}`}>
              <Button size="lg">
                🔧 {platform.displayName} 사진 자동 조정하기
              </Button>
            </Link>
          </div>
        </Card>

        {/* Spec Summary */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 {platform.displayName} {specLabel}
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
              <p className="text-sm text-gray-500 mb-1">권장 용량</p>
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

          {/* Source Info */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              출처: {platform.source.name}
            </span>
            {platform.source.isEstimate && (
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                사용자 경험 기반 추정치
              </span>
            )}
          </div>
        </Card>

        {/* Official Standard Reference */}
        {(platform.id === 'drivers-license' || platform.id === 'id-card') && (
          <Card className="mb-6 bg-green-50 border-green-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              ✅ 공식 규격 안내
            </h2>
            <p className="text-gray-700 text-sm">
              {platform.displayName} 사진은 <strong>여권사진 규격</strong>과 동일합니다.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              {OFFICIAL_STANDARDS.passport.physical} ({OFFICIAL_STANDARDS.passport.pixels})
            </p>
            <p className="text-xs text-gray-500 mt-2">
              여권용으로 촬영한 사진을 그대로 사용할 수 있습니다.
            </p>
          </Card>
        )}

        {/* Platform Note */}
        {platform.platformNote && (
          <Card className="mb-6 bg-blue-50 border-blue-100">
            <p className="text-sm text-blue-700">
              💡 {platform.platformNote}
            </p>
          </Card>
        )}

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
            ⚠️ 흔한 업로드 실패 원인
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">❌</span>
              <div>
                <h3 className="font-medium text-gray-900">파일 용량 초과</h3>
                <p className="text-sm text-gray-600">
                  스마트폰으로 찍은 사진은 보통 2~5MB입니다.
                  플랫폼 제한보다 큰 경우 업로드가 거부됩니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">❌</span>
              <div>
                <h3 className="font-medium text-gray-900">비율 불일치</h3>
                <p className="text-sm text-gray-600">
                  일반 사진(4:3, 16:9)은 증명사진 비율({platform.dimensions.ratio})과
                  다릅니다. 크롭이 필요합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">❌</span>
              <div>
                <h3 className="font-medium text-gray-900">지원하지 않는 형식</h3>
                <p className="text-sm text-gray-600">
                  아이폰의 HEIC, 웹용 WEBP 형식은 많은 플랫폼에서 지원되지 않습니다.
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
                {platform.source.isEstimate ? '권장 규격은' : '공식 규격은'}{' '}
                {platform.dimensions.width}×{platform.dimensions.height}px
                (비율 {platform.dimensions.ratio}), 용량 {platform.maxSizeKB}KB 이하입니다.
                {platform.source.isEstimate && ' 실제 플랫폼 요구사항은 다를 수 있습니다.'}
              </p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Q. 스마트폰으로 찍은 사진을 사용해도 되나요?
              </h3>
              <p className="text-gray-600 text-sm">
                네, 스마트폰 사진도 사용 가능합니다. 다만 용량이 크고 비율이 맞지
                않아 조정이 필요합니다. 사진규격 맞춤을 사용하면 권장 규격에 맞게
                자동으로 변환됩니다.
              </p>
            </div>
            {additionalFAQs.map((faq, i) => (
              <div
                key={i}
                className={i < additionalFAQs.length - 1 ? 'border-b border-gray-100 pb-4' : ''}
              >
                <h3 className="font-medium text-gray-900 mb-2">Q. {faq.question}</h3>
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
              🔧 자동으로 규격 조정하기
            </Button>
          </Link>
        </div>

        {/* Related Platforms */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📌 다른 제출처 가이드
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
                  <span className="text-xl" aria-hidden="true">
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

        {/* Source & Disclaimer */}
        <div className="mt-8 space-y-4">
          {/* Source */}
          <Card className="bg-gray-50 border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              📖 규격 정보 출처
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>참고:</strong> {platform.source.name}
                {platform.source.url && (
                  <>
                    {' '}(
                    <a
                      href={platform.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      공식 사이트
                    </a>
                    )
                  </>
                )}
              </p>
              <p>
                <strong>마지막 확인:</strong> {platform.source.lastVerified}
              </p>
              {platform.source.isEstimate && (
                <p className="text-amber-700">
                  ⚠️ 본 규격은 사용자 경험 기반 추정치입니다.
                  플랫폼의 공식 API 문서가 공개되지 않아 실제와 다를 수 있습니다.
                </p>
              )}
            </div>
          </Card>

          {/* Legal Disclaimer */}
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-sm text-amber-800 mb-2">
              <strong>면책 안내:</strong>
            </p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• 본 서비스는 사진 규격 변환을 도와주는 <strong>보조 도구</strong>입니다.</li>
              <li>• 사진 편집기나 증명사진 제작 서비스가 아닙니다.</li>
              <li>• <strong>업로드 통과를 보장하지 않습니다.</strong></li>
              <li>• 최종 결과는 {platform.displayName} 심사 기준에 따릅니다.</li>
              <li>• 정확한 규격은 반드시 공식 안내 페이지를 확인하세요.</li>
            </ul>
          </div>
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
        question: '업로드 실패가 계속 되면 어떻게 하나요?',
        answer: '용량을 더 줄여보세요. 플랫폼마다 실제 제한이 다를 수 있어, 권장 용량보다 더 작게 조정하면 성공 확률이 높아집니다.',
      },
    ],
    saramin: [
      {
        question: '사람인과 잡코리아 사진을 같이 써도 되나요?',
        answer: '네, 두 플랫폼 모두 비슷한 온라인 이력서 사진 규격을 사용합니다. 한 번 조정한 사진을 두 곳 모두 사용할 수 있습니다.',
      },
      {
        question: '정장을 입어야 하나요?',
        answer: '지원하는 업종에 따라 다릅니다. 일반 기업은 단정한 셔츠나 정장, 크리에이티브 업종은 깔끔한 캐주얼도 무방합니다.',
      },
    ],
    'drivers-license': [
      {
        question: '운전면허증 사진에 안경을 쓰고 찍어도 되나요?',
        answer: '네, 안경 착용 가능합니다. 단, 색안경이나 선글라스는 불가하며, 안경 렌즈에 빛 반사가 없어야 합니다.',
      },
      {
        question: '여권 사진을 운전면허증에 그대로 사용할 수 있나요?',
        answer: '네, 운전면허증과 여권은 동일한 규격(3.5cm × 4.5cm)을 사용합니다. 여권용으로 촬영한 사진을 그대로 사용할 수 있습니다.',
      },
    ],
    'id-card': [
      {
        question: '주민등록증과 여권 사진 규격이 같나요?',
        answer: '네, 주민등록증도 여권사진 규격(3.5cm × 4.5cm)을 사용합니다. 여권용으로 촬영한 사진을 그대로 사용할 수 있습니다.',
      },
      {
        question: '화장을 해도 되나요?',
        answer: '자연스러운 화장은 괜찮습니다. 단, 본인 확인이 어려울 정도의 진한 화장은 피하세요.',
      },
    ],
  };

  return faqs[platformId] || [];
}
