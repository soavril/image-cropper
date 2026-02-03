'use client';

import type { PlatformConfig } from '@/lib/platforms/config';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils/format';

interface ImageAnalysis {
  width: number;
  height: number;
  sizeBytes: number;
  format: string;
}

interface PassFailChecklistProps {
  platform: PlatformConfig;
  originalAnalysis: ImageAnalysis;
  fixedAnalysis: ImageAnalysis;
  onDownload: () => void;
  onManualAdjust: () => void;
}

interface CheckItem {
  label: string;
  passed: boolean;
  current: string;
  required: string;
  isRecommended: boolean;
}

/**
 * Phase 1: PASS/FAIL 체크리스트
 *
 * 사용자에게 결과를 명확하게 보여주고
 * "다운로드" 또는 "위치 조정" 선택지 제공
 */
export function PassFailChecklist({
  platform,
  originalAnalysis,
  fixedAnalysis,
  onDownload,
  onManualAdjust,
}: PassFailChecklistProps) {
  // 체크 항목 생성
  const checks: CheckItem[] = [
    {
      label: '비율',
      passed: true, // 자동 조정 후 항상 맞음
      current: platform.aspectRatio,
      required: platform.aspectRatio,
      isRecommended: false,
    },
    {
      label: '크기',
      passed: fixedAnalysis.width === platform.pixelSize.width &&
              fixedAnalysis.height === platform.pixelSize.height,
      current: `${fixedAnalysis.width}×${fixedAnalysis.height}px`,
      required: `${platform.pixelSize.width}×${platform.pixelSize.height}px`,
      isRecommended: !platform.pixelSize.isOfficial,
    },
    {
      label: '용량',
      passed: fixedAnalysis.sizeBytes <= platform.maxSizeKB * 1024,
      current: formatBytes(fixedAnalysis.sizeBytes),
      required: `${platform.maxSizeKB}KB 이하`,
      isRecommended: !platform.isMaxSizeOfficial,
    },
    {
      label: '포맷',
      passed: platform.formats.includes(fixedAnalysis.format.toLowerCase() as 'jpg' | 'png'),
      current: fixedAnalysis.format.toUpperCase(),
      required: platform.formats.map(f => f.toUpperCase()).join('/'),
      isRecommended: false,
    },
  ];

  const allPassed = checks.every(c => c.passed);
  const passedCount = checks.filter(c => c.passed).length;

  return (
    <Card>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📋 {platform.displayName} 규격 검사
        </h3>
        <span
          className={cn(
            'text-sm font-medium px-3 py-1 rounded-full',
            allPassed
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          )}
        >
          {passedCount}/{checks.length} 통과
        </span>
      </div>

      {/* 체크리스트 */}
      <div className="space-y-2 mb-6">
        {checks.map((check, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg',
              check.passed ? 'bg-gray-50' : 'bg-red-50'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {check.passed ? '✅' : '❌'}
              </span>
              <span className={cn(
                'font-medium',
                !check.passed && 'text-red-700'
              )}>
                {check.label}
                {check.isRecommended && (
                  <span className="ml-1 text-xs text-gray-400">(권장)</span>
                )}
              </span>
            </div>
            <div className="text-right text-sm">
              <span className={cn(
                check.passed ? 'text-green-600' : 'text-red-600',
                'font-medium'
              )}>
                {check.current}
              </span>
              {!check.passed && (
                <span className="text-gray-400 ml-2 text-xs">
                  (기준: {check.required})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Before/After 요약 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">변환 전</p>
            <p className="text-sm font-medium text-gray-700">
              {formatBytes(originalAnalysis.sizeBytes)}
            </p>
            <p className="text-xs text-gray-400">
              {originalAnalysis.width}×{originalAnalysis.height}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">변환 후</p>
            <p className="text-sm font-medium text-blue-600">
              {formatBytes(fixedAnalysis.sizeBytes)}
            </p>
            <p className="text-xs text-blue-500">
              {fixedAnalysis.width}×{fixedAnalysis.height}
            </p>
          </div>
        </div>
      </div>

      {/* 결과 메시지 */}
      {allPassed ? (
        <div className="text-center py-3 bg-green-50 rounded-xl mb-6">
          <p className="text-green-700 font-medium">
            ✅ 권장 규격에 맞게 조정되었습니다
          </p>
        </div>
      ) : (
        <div className="text-center py-3 bg-amber-50 rounded-xl mb-6">
          <p className="text-amber-700">
            ⚠️ 일부 항목이 권장 기준과 다릅니다
          </p>
          <p className="text-xs text-amber-600 mt-1">
            대부분의 경우 문제없이 사용 가능합니다
          </p>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="space-y-3">
        <Button
          onClick={onDownload}
          className="w-full"
          size="lg"
        >
          📥 이 결과로 다운로드
        </Button>

        <button
          onClick={onManualAdjust}
          className="w-full py-3 text-gray-600 hover:text-blue-600 text-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>🖼️</span>
          <span>얼굴 위치가 마음에 안 드시나요? 직접 조정하기</span>
        </button>
      </div>

      {/* 안내 메시지 */}
      <p className="text-xs text-gray-400 text-center mt-4">
        결과를 확인한 후 다운로드하세요.
        {!platform.source.isOfficial && (
          <span className="block mt-1">
            ※ 권장 규격 기준이며, 최종 통과는 {platform.displayName} 심사에 따릅니다.
          </span>
        )}
      </p>
    </Card>
  );
}
