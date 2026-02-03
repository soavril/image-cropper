'use client';

import { useState } from 'react';
import type { PlatformSpec } from '@/types';
import { Card } from '@/components/ui/Card';
import {
  ImageUploader,
  PassFailChecklist,
  ManualFrameEditor,
  ResultPreview,
  DownloadButton,
  TrustBlock,
} from '@/components/fixer';
import type { CropArea } from '@/components/fixer';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { getPlatformConfig } from '@/lib/platforms';
import Link from 'next/link';

interface FixPageClientProps {
  platform: PlatformSpec;
}

type ViewMode = 'upload' | 'result' | 'manual' | 'final';

/**
 * Phase 1 + 1.5 퍼널 플로우:
 *
 * 1. upload: 이미지 업로드
 * 2. result: 자동 조정 결과 + PassFailChecklist
 *    → "다운로드" 클릭 → final
 *    → "직접 조정" 클릭 → manual
 * 3. manual: ManualFrameEditor
 *    → "저장" 클릭 → final
 * 4. final: 최종 결과 + 다운로드
 */
export function FixPageClient({ platform }: FixPageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('upload');

  const {
    status,
    image,
    analysis,
    fixResult,
    blob,
    error,
    upload,
    fixWithManualCrop,
    reset,
  } = useImageProcessor();

  // 플랫폼 설정 (상세 정보 포함)
  const platformConfig = getPlatformConfig(platform.id);

  // 업로드 핸들러
  const handleUpload = async (file: File) => {
    await upload(file, platform);
    setViewMode('result');
  };

  // 다운로드 → 최종 화면으로 이동
  const handleDownload = () => {
    setViewMode('final');
  };

  // 수동 조정 모드로 이동
  const handleManualAdjust = () => {
    setViewMode('manual');
  };

  // 수동 조정 완료
  const handleManualConfirm = async (cropArea: CropArea) => {
    if (platformConfig) {
      await fixWithManualCrop(platform, cropArea);
    }
    setViewMode('final');
  };

  // 수동 조정 취소
  const handleManualCancel = () => {
    setViewMode('result');
  };

  // 리셋
  const handleReset = () => {
    reset();
    setViewMode('upload');
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

      {/* 플랫폼 안내 메시지 */}
      {platform.platformNote && viewMode === 'upload' && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 {platform.platformNote}
          </p>
        </div>
      )}

      {/* 에러 */}
      {error && (
        <Card className="mb-6 bg-red-50 border-red-100">
          <p className="text-red-700 mb-3">{error}</p>
          <button
            onClick={handleReset}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            다시 시도
          </button>
        </Card>
      )}

      {/* ===== View: Upload ===== */}
      {viewMode === 'upload' && status === 'idle' && (
        <div className="mb-6">
          <ImageUploader onUpload={handleUpload} />
        </div>
      )}

      {/* ===== Loading ===== */}
      {(status === 'analyzing' || status === 'fixing') && (
        <Card className="mb-6 text-center py-8">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">
            {status === 'analyzing' ? '사진을 분석하고 있습니다...' : '규격에 맞게 조정하고 있습니다...'}
          </p>
        </Card>
      )}

      {/* ===== View: Result (자동 조정 결과) ===== */}
      {viewMode === 'result' && status === 'done' && fixResult && platformConfig && (
        <>
          <div className="mb-6">
            <PassFailChecklist
              platform={platformConfig}
              originalAnalysis={{
                width: image!.currentDimensions.width,
                height: image!.currentDimensions.height,
                sizeBytes: image!.sizeBytes,
                format: image!.format,
              }}
              fixedAnalysis={{
                width: fixResult.fixed.currentDimensions.width,
                height: fixResult.fixed.currentDimensions.height,
                sizeBytes: fixResult.fixed.sizeBytes,
                format: fixResult.fixed.format,
              }}
              onDownload={handleDownload}
              onManualAdjust={handleManualAdjust}
            />
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← 다른 사진 업로드
          </button>
        </>
      )}

      {/* ===== View: Manual Frame Editor ===== */}
      {viewMode === 'manual' && image && platformConfig && (
        <div className="mb-6">
          <ManualFrameEditor
            canvas={image.canvas}
            platform={platformConfig}
            onConfirm={handleManualConfirm}
            onCancel={handleManualCancel}
          />
        </div>
      )}

      {/* ===== View: Final (다운로드) ===== */}
      {viewMode === 'final' && fixResult && blob && (
        <>
          <div className="mb-6">
            <ResultPreview result={fixResult} />
          </div>

          <div className="mb-6">
            <DownloadButton blob={blob} platform={platform} />
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← 다른 사진 조정하기
          </button>
        </>
      )}

      {/* 플랫폼 규격 정보 (upload 모드에서만) */}
      {viewMode === 'upload' && (
        <Card className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📋 {platform.displayName} 권장 규격
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">권장 크기</span>
              <span className="font-medium">
                {platform.dimensions.width} × {platform.dimensions.height}px
                {!platformConfig?.pixelSize.isOfficial && (
                  <span className="text-xs text-gray-400 ml-1">(권장)</span>
                )}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">물리 크기</span>
              <span className="font-medium">
                {platformConfig?.physicalSize.width}cm × {platformConfig?.physicalSize.height}cm
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">권장 용량</span>
              <span className="font-medium">
                {platform.maxSizeKB}KB 이하
                {!platformConfig?.isMaxSizeOfficial && (
                  <span className="text-xs text-gray-400 ml-1">(권장)</span>
                )}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">지원 형식</span>
              <span className="font-medium">
                {platform.formats.map((f) => f.toUpperCase()).join(', ')}
              </span>
            </div>
          </div>

          {/* 출처 정보 */}
          {platformConfig && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                출처: {platformConfig.source.name}
                {!platformConfig.source.isOfficial && (
                  <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                    권장 규격
                  </span>
                )}
              </p>
            </div>
          )}

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
      )}

      {/* 다른 플랫폼 링크 */}
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

      {/* 면책 조항 */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-sm text-amber-800 mb-2">
          <strong>면책 안내:</strong>
        </p>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• 본 서비스는 {platform.displayName}와 제휴 관계가 없는 독립 서비스입니다.</li>
          <li>• 사진 규격 변환을 도와주는 보조 도구이며, <strong>업로드 통과를 보장하지 않습니다.</strong></li>
          <li>• 최종 결과는 해당 플랫폼/기관의 심사 기준에 따릅니다.</li>
          {!platformConfig?.source.isOfficial && (
            <li>• 표시된 규격은 권장 기준이며, 정확한 규격은 공식 안내를 확인하세요.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
