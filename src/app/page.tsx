import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { TrustBlock } from '@/components/fixer/TrustBlock';
import { getAllPlatforms } from '@/lib/platforms';
import { WebApplicationSchema, OrganizationSchema } from '@/components/seo';

export default function HomePage() {
  const platforms = getAllPlatforms();

  return (
    <>
      {/* Structured Data */}
      <WebApplicationSchema />
      <OrganizationSchema />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            사진 업로드 안됨?
            <br />
            <span className="text-blue-600">3초만에 해결하세요</span>
          </h1>
          <p className="text-gray-600 text-lg">
            용량 초과, 규격 오류 — 자동으로 맞춰드립니다
          </p>
        </section>

        {/* Trust Block */}
        <div className="mb-8">
          <TrustBlock />
        </div>

        {/* Platform Selection */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            어디에 제출하시나요?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {platforms.map((platform) => (
              <Link
                key={platform.id}
                href={`/fix/${platform.name}`}
                className="flex flex-col items-center p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-200"
              >
                <span className="text-3xl mb-2">
                  {platform.id === 'jobkorea' && '💼'}
                  {platform.id === 'saramin' && '👔'}
                  {platform.id === 'drivers-license' && '🚗'}
                  {platform.id === 'id-card' && '🪪'}
                </span>
                <span className="font-medium text-gray-900">
                  {platform.displayName}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {platform.maxSizeKB}KB 이하
                </span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Features */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            이런 분들께 추천드려요
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-0.5">✓</span>
              <span>이력서 사진이 자꾸 업로드 안 되시는 분</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-0.5">✓</span>
              <span>운전면허 갱신하려는데 사진 규격이 안 맞는 분</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-0.5">✓</span>
              <span>증명사진 용량을 빨리 줄여야 하는 분</span>
            </li>
          </ul>
        </Card>

        {/* How It Works */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            사용 방법
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900">플랫폼 선택</h3>
                <p className="text-sm text-gray-500">
                  제출할 플랫폼을 선택하세요
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-900">사진 업로드</h3>
                <p className="text-sm text-gray-500">
                  문제가 있는 사진을 업로드하세요
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-900">자동 수정 & 다운로드</h3>
                <p className="text-sm text-gray-500">
                  규격에 맞게 자동으로 수정된 사진을 다운로드하세요
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* SEO Content */}
        <section className="mt-12 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            사진 업로드 오류, 왜 발생할까요?
          </h2>
          <p className="text-gray-600 mb-4">
            잡코리아, 사람인 같은 채용 사이트나 운전면허 갱신 시 사진 업로드가
            실패하는 가장 흔한 원인은 <strong>파일 용량 초과</strong>와{' '}
            <strong>규격 불일치</strong>입니다.
          </p>
          <ul className="text-gray-600 space-y-2 mb-4">
            <li>• 파일 크기가 500KB를 초과하는 경우</li>
            <li>• 이미지 비율이 3:4 또는 4:5가 아닌 경우</li>
            <li>• 해상도가 요구 사항보다 작거나 큰 경우</li>
            <li>• 지원하지 않는 파일 형식 (예: HEIC, WEBP)</li>
          </ul>
          <p className="text-gray-600">
            제출사진 해결사는 이러한 문제를 자동으로 감지하고 수정합니다.
            브라우저에서 바로 처리되므로 개인정보 걱정 없이 사용할 수 있습니다.
          </p>
        </section>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-sm text-amber-800 mb-2">
            <strong>면책 안내:</strong>
          </p>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• 본 서비스는 사진 규격 변환을 도와드리는 보조 도구입니다.</li>
            <li>• 규격 정보는 사용자 경험 기반 추정치이며, 공식 정보와 다를 수 있습니다.</li>
            <li>• <strong>100% 통과를 보장하지 않습니다.</strong> 최종 결과는 해당 플랫폼의 심사 기준에 따릅니다.</li>
            <li>• 정확한 규격은 각 플랫폼의 공식 안내를 확인하세요.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
