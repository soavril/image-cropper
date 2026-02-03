import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { TrustBlock } from '@/components/fixer/TrustBlock';
import { getAllPlatforms, OFFICIAL_STANDARDS } from '@/lib/platforms';
import { WebApplicationSchema, OrganizationSchema } from '@/components/seo';

/**
 * 홈페이지 - 제출사진 해결사
 *
 * 포지셔닝: 사진 편집기가 아닌 "업로드 실패 방지 도구"
 * 핵심 약속: 사진 업로드 오류를 줄여주는 규격 자동 맞춤 도구
 */
export default function HomePage() {
  const platforms = getAllPlatforms();

  return (
    <>
      {/* Structured Data */}
      <WebApplicationSchema />
      <OrganizationSchema />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero - 문제 기반 H1 */}
        <section className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            사진 업로드 안됨?
            <br />
            <span className="text-blue-600">3초만에 해결하세요</span>
          </h1>
          <p className="text-gray-600 text-lg">
            채용 사이트·면허·신분증 제출용 사진을
            <br className="sm:hidden" />
            권장 규격에 맞게 자동으로 조정합니다
          </p>
        </section>

        {/* Trust Block - 개인정보 보호 강조 */}
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
                <span className="text-3xl mb-2" aria-hidden="true">
                  {platform.id === 'jobkorea' && '💼'}
                  {platform.id === 'saramin' && '👔'}
                  {platform.id === 'drivers-license' && '🚗'}
                  {platform.id === 'id-card' && '🪪'}
                </span>
                <span className="font-medium text-gray-900">
                  {platform.displayName}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {platform.source.isEstimate ? '권장 규격' : '공식 규격'}
                </span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Features - 타겟 사용자 */}
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
              <span>HEIC, WEBP 사진을 JPG로 변환해야 하는 분</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-0.5">✓</span>
              <span>사진 용량을 빠르게 줄여야 하는 분</span>
            </li>
          </ul>
        </Card>

        {/* How It Works */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            사용 방법
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900">제출처 선택</h3>
                <p className="text-sm text-gray-500">
                  어디에 제출할 사진인지 선택하세요
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
                  업로드 안 되는 사진을 올려주세요
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-900">자동 조정 & 다운로드</h3>
                <p className="text-sm text-gray-500">
                  권장 규격에 맞게 조정된 사진을 받으세요
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Official Standards Reference */}
        <Card className="mb-8 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📐 공식 규격 안내
          </h2>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-white rounded-lg">
              <h3 className="font-medium text-gray-900 mb-1">
                운전면허증 / 주민등록증 / 여권
              </h3>
              <p className="text-gray-600">
                {OFFICIAL_STANDARDS.passport.physical} ({OFFICIAL_STANDARDS.passport.pixels})
              </p>
              <p className="text-xs text-gray-400 mt-1">
                세 종류 모두 동일한 규격을 사용합니다
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <h3 className="font-medium text-gray-900 mb-1">
                이력서 사진 (온라인)
              </h3>
              <p className="text-gray-600">
                {OFFICIAL_STANDARDS.resumeOnline.pixels}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                플랫폼마다 픽셀/용량 제한이 다를 수 있습니다
              </p>
            </div>
          </div>
        </Card>

        {/* FAQ Section - SEO & Trust */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            💬 자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Q. 왜 사진 업로드가 실패하나요?
              </h3>
              <p className="text-gray-600 text-sm">
                대부분 <strong>파일 용량 초과</strong>, <strong>비율 불일치</strong>,
                <strong>지원하지 않는 형식</strong>(HEIC, WEBP) 때문입니다.
                스마트폰으로 찍은 사진은 보통 2~5MB로, 대부분의 플랫폼 제한을 초과합니다.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Q. 여권 사진으로 면허/주민등록증에 사용 가능한가요?
              </h3>
              <p className="text-gray-600 text-sm">
                네, 운전면허증과 주민등록증은 여권사진과 동일한 규격(3.5cm × 4.5cm)을
                사용합니다. 여권용으로 촬영한 사진을 그대로 사용할 수 있습니다.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Q. 사진 용량이 왜 중요한가요?
              </h3>
              <p className="text-gray-600 text-sm">
                온라인 플랫폼은 서버 부하와 로딩 속도를 위해 업로드 용량을 제한합니다.
                제한을 초과하면 업로드가 거부되거나 오류가 발생합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Q. 결과가 왜 플랫폼마다 다를 수 있나요?
              </h3>
              <p className="text-gray-600 text-sm">
                각 플랫폼(은행, 정부 사이트, 채용 포털)마다 요구하는 세부 규격이 다릅니다.
                본 서비스는 일반적인 권장 규격에 맞춰 조정하지만,
                <strong> 최종 통과 여부는 각 기관의 심사 기준에 따릅니다.</strong>
              </p>
            </div>
          </div>
        </Card>

        {/* SEO Content */}
        <section className="mb-8 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            사진 업로드 오류, 왜 발생할까요?
          </h2>
          <p className="text-gray-600 mb-4">
            잡코리아, 사람인 같은 채용 사이트나 운전면허 갱신 시 사진 업로드가
            실패하는 가장 흔한 원인은 다음과 같습니다:
          </p>
          <ul className="text-gray-600 space-y-2 mb-4">
            <li>• <strong>파일 용량 초과</strong> - 스마트폰 사진은 보통 2~5MB</li>
            <li>• <strong>비율 불일치</strong> - 일반 사진(4:3, 16:9)과 증명사진 비율이 다름</li>
            <li>• <strong>해상도 문제</strong> - 너무 크거나 작은 픽셀 크기</li>
            <li>• <strong>파일 형식</strong> - HEIC(아이폰), WEBP 미지원</li>
          </ul>
          <p className="text-gray-600">
            제출사진 해결사는 이러한 문제를 자동으로 감지하고 권장 규격에 맞게 조정합니다.
            브라우저에서 바로 처리되므로 개인정보 걱정 없이 사용할 수 있습니다.
          </p>
        </section>

        {/* Legal Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-sm text-amber-800 mb-2">
            <strong>면책 안내:</strong>
          </p>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>
              • 본 서비스는 사진 규격 변환을 도와주는 <strong>보조 도구</strong>입니다.
            </li>
            <li>
              • 사진 편집기나 증명사진 제작 서비스가 아닙니다.
            </li>
            <li>
              • <strong>업로드 통과를 보장하지 않습니다.</strong>
            </li>
            <li>
              • 최종 제출 결과는 각 플랫폼 및 기관의 심사 기준에 따릅니다.
            </li>
            <li>
              • 정확한 규격은 해당 플랫폼의 공식 안내를 확인하세요.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
