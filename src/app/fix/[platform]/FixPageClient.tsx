'use client';

import type { PlatformSpec } from '@/types';
import { Card } from '@/components/ui/Card';
import { ImageUploader } from '@/components/fixer/ImageUploader';
import { SpecChecker } from '@/components/fixer/SpecChecker';
import { ResultPreview } from '@/components/fixer/ResultPreview';
import { DownloadButton } from '@/components/fixer/DownloadButton';
import { TrustBlock } from '@/components/fixer/TrustBlock';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import Link from 'next/link';

interface FixPageClientProps {
  platform: PlatformSpec;
}

/**
 * Fix 페이지 클라이언트 컴포넌트
 *
 * 핵심 원칙:
 * - 사진 편집기가 아닌 "업로드 실패 방지 도구"
 * - "권장 규격" 표현 사용, "통과 보장" 금지
 * - 실제 출력 파일 크기 명시
 */
export function FixPageClient({ platform }: FixPageClientProps) {
  const {
    status,
    analysis,
    fixResult,
    blob,
    error,
    upload,
    fix,
    reset,
  } = useImageProcessor();

  const handleUpload = async (file: File) => {
    await upload(file, platform);
  };

  const handleFix = async () => {
    await fix(platform);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-6">
        <p className="text-blue-600 font-medium mb-2">{platform.displayName}</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          사진 업로드 안됨?
          <br />
          <span className="text-blue-600">3초만에 해결하세요</span>
        </h1>
        <p className="text-gray-600">
          권장 규격에 맞게 자동으로 조정합니다
        </p>
      </section>

      {/* Trust Block */}
      <div className="mb-6">
        <TrustBlock />
      </div>

      {/* Platform Note - 플랫폼별 추가 안내 */}
      {platform.platformNote && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 {platform.platformNote}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="mb-6 bg-red-50 border-red-100">
          <p className="text-red-700">{error}</p>
          <button
            onClick={reset}
            className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            다시 시도
          </button>
        </Card>
      )}

      {/* Uploader */}
      {status === 'idle' && (
        <div className="mb-6">
          <ImageUploader onUpload={handleUpload} />
        </div>
      )}

      {/* Loading - Analyzing */}
      {status === 'analyzing' && (
        <Card className="mb-6 text-center py-8">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">사진을 분석하고 있습니다...</p>
        </Card>
      )}

      {/* Loading - Fixing */}
      {status === 'fixing' && (
        <Card className="mb-6 text-center py-8">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">권장 규격에 맞게 조정하고 있습니다...</p>
        </Card>
      )}

      {/* Analysis Result */}
      {status === 'done' && analysis && !fixResult && (
        <>
          <div className="mb-6">
            <SpecChecker
              platform={platform}
              result={analysis}
              onFix={handleFix}
              isFixing={false}
            />
          </div>
          <button
            onClick={reset}
            className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← 다른 사진 업로드
          </button>
        </>
      )}

      {/* Fix Result */}
      {fixResult && (
        <>
          <div className="mb-6">
            <ResultPreview result={fixResult} />
          </div>
          <div className="mb-6">
            <DownloadButton blob={blob} platform={platform} />
          </div>
          <button
            onClick={reset}
            className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← 다른 사진 조정하기
          </button>
        </>
      )}

      {/* Platform Spec Info */}
      <Card className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📋 {platform.displayName} 권장 규격
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">권장 크기</span>
            <span className="font-medium">
              {platform.dimensions.width} × {platform.dimensions.height}px
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">권장 용량</span>
            <span className="font-medium">{platform.maxSizeKB}KB 이하</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">비율</span>
            <span className="font-medium">{platform.dimensions.ratio}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">지원 형식</span>
            <span className="font-medium">
              {platform.formats.map((f) => f.toUpperCase()).join(', ')}
            </span>
          </div>
        </div>

        {/* Source Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>출처: {platform.source.name}</span>
            {platform.source.isEstimate && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                추정치
              </span>
            )}
          </div>
        </div>

        {platform.notes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">촬영 시 참고사항</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {platform.notes.map((note, i) => (
                <li key={i}>• {note}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Related Links */}
      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📌 다른 제출처도 확인하세요
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {platform.id !== 'jobkorea' && (
            <Link
              href="/fix/jobkorea"
              className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-center transition-colors"
            >
              <span className="text-xl" aria-hidden="true">💼</span>
              <p className="text-sm font-medium mt-1">잡코리아</p>
            </Link>
          )}
          {platform.id !== 'saramin' && (
            <Link
              href="/fix/saramin"
              className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-center transition-colors"
            >
              <span className="text-xl" aria-hidden="true">👔</span>
              <p className="text-sm font-medium mt-1">사람인</p>
            </Link>
          )}
          {platform.id !== 'drivers-license' && (
            <Link
              href="/fix/drivers-license"
              className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-center transition-colors"
            >
              <span className="text-xl" aria-hidden="true">🚗</span>
              <p className="text-sm font-medium mt-1">운전면허증</p>
            </Link>
          )}
          {platform.id !== 'id-card' && (
            <Link
              href="/fix/id-card"
              className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-center transition-colors"
            >
              <span className="text-xl" aria-hidden="true">🪪</span>
              <p className="text-sm font-medium mt-1">주민등록증</p>
            </Link>
          )}
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-sm text-amber-800 mb-2">
          <strong>면책 안내:</strong>
        </p>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• 본 서비스는 {platform.displayName}와 제휴 관계가 없는 독립 서비스입니다.</li>
          <li>• 사진 규격 변환을 도와주는 보조 도구이며, <strong>업로드 통과를 보장하지 않습니다.</strong></li>
          <li>• 최종 결과는 해당 플랫폼/기관의 심사 기준에 따릅니다.</li>
          {platform.source.url && (
            <li>
              • 정확한 규격:{' '}
              <a
                href={platform.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {platform.source.name} 공식 안내
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
