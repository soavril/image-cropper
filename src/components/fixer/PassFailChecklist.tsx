'use client';

import type { AnalysisResult, AnalysisIssue } from '@/types';
import type { PlatformConfig } from '@/lib/platforms/config';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils/format';

interface ImageInfo {
  width: number;
  height: number;
  sizeBytes: number;
  format: string;
}

interface PassFailChecklistProps {
  platform: PlatformConfig;
  originalImage: ImageInfo;
  originalAnalysis: AnalysisResult;
  fixedImage: ImageInfo;
  onDownload: () => void;
  onManualAdjust: () => void;
}

/**
 * Phase 1: Original ❌ → Converted ✅ 체크리스트
 *
 * 1. 원본 진단: 문제 항목 ❌ 표시
 * 2. 변환 완료 표시
 * 3. 변환 결과: 모든 항목 ✅
 */
export function PassFailChecklist({
  platform,
  originalImage,
  originalAnalysis,
  fixedImage,
  onDownload,
  onManualAdjust,
}: PassFailChecklistProps) {
  // 원본 분석에서 실패한 항목 수
  const failedCount = originalAnalysis.issues.filter(i => !i.passed).length;
  const totalCount = originalAnalysis.issues.length;

  // 이슈 타입을 한글 라벨로 매핑
  const getIssueLabel = (issue: AnalysisIssue): string => {
    switch (issue.type) {
      case 'size': return '용량';
      case 'width': return '너비';
      case 'height': return '높이';
      case 'ratio': return '비율';
      case 'format': return '포맷';
      default: return issue.label;
    }
  };

  // 권장 규격 여부 확인
  const isRecommended = (issue: AnalysisIssue): boolean => {
    if (issue.type === 'size') return !platform.isMaxSizeOfficial;
    if (issue.type === 'width' || issue.type === 'height') return !platform.pixelSize.isOfficial;
    return false;
  };

  return (
    <Card className="overflow-hidden">
      {/* ===== 섹션 1: 원본 사진 진단 ===== */}
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            🔍 원본 사진 진단
          </h3>
          {failedCount > 0 ? (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-600">
              {failedCount}개 문제 발견
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
              문제 없음
            </span>
          )}
        </div>

        {/* 원본 정보 요약 */}
        <div className="text-xs text-gray-500 mb-3">
          {originalImage.width}×{originalImage.height}px · {formatBytes(originalImage.sizeBytes)} · {originalImage.format.toUpperCase()}
        </div>

        {/* 원본 체크리스트 */}
        <div className="space-y-2">
          {originalAnalysis.issues.map((issue, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center justify-between p-2 rounded-lg text-sm',
                issue.passed ? 'bg-white' : 'bg-red-50'
              )}
            >
              <div className="flex items-center gap-2">
                <span className={issue.passed ? 'text-green-500' : 'text-red-500'}>
                  {issue.passed ? '✓' : '✗'}
                </span>
                <span className={cn(
                  'font-medium',
                  !issue.passed && 'text-red-700'
                )}>
                  {getIssueLabel(issue)}
                  {isRecommended(issue) && (
                    <span className="ml-1 text-xs text-gray-400">(권장)</span>
                  )}
                </span>
              </div>
              <div className="text-right">
                <span className={cn(
                  'font-medium',
                  issue.passed ? 'text-gray-600' : 'text-red-600'
                )}>
                  {issue.current}
                </span>
                {!issue.passed && (
                  <span className="text-gray-400 ml-1 text-xs">
                    → {issue.required}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 변환 완료 표시 ===== */}
      <div className="flex items-center justify-center py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center gap-2 text-blue-600">
          <span className="text-lg">↓</span>
          <span className="text-sm font-medium">자동 변환 완료</span>
          <span className="text-lg">↓</span>
        </div>
      </div>

      {/* ===== 섹션 2: 변환 결과 ===== */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            ✅ 변환 결과
          </h3>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
            {totalCount}/{totalCount} 통과
          </span>
        </div>

        {/* 변환 후 정보 요약 */}
        <div className="text-xs text-blue-600 mb-3">
          {fixedImage.width}×{fixedImage.height}px · {formatBytes(fixedImage.sizeBytes)} · {fixedImage.format.toUpperCase()}
        </div>

        {/* 변환 결과 체크리스트 (모두 통과) */}
        <div className="space-y-2 mb-4">
          {[
            { label: '크기', value: `${fixedImage.width}×${fixedImage.height}px`, isRecommended: !platform.pixelSize.isOfficial },
            { label: '용량', value: formatBytes(fixedImage.sizeBytes), isRecommended: !platform.isMaxSizeOfficial },
            { label: '비율', value: platform.aspectRatio, isRecommended: false },
            { label: '포맷', value: fixedImage.format.toUpperCase(), isRecommended: false },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-green-50 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="font-medium text-green-700">
                  {item.label}
                  {item.isRecommended && (
                    <span className="ml-1 text-xs text-gray-400">(권장)</span>
                  )}
                </span>
              </div>
              <span className="font-medium text-green-600">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* 성공 메시지 */}
        <div className="text-center py-3 bg-green-50 rounded-xl mb-4">
          <p className="text-green-700 font-medium text-sm">
            {failedCount > 0
              ? `❌ ${failedCount}개 문제 → ✅ 모두 해결됨`
              : '✅ 권장 규격에 맞는 사진입니다'}
          </p>
        </div>

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
            className="w-full py-3 text-gray-500 hover:text-blue-600 text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>🖼️</span>
            <span>얼굴 위치 직접 조정하기</span>
          </button>
        </div>

        {/* 안내 메시지 */}
        <p className="text-xs text-gray-400 text-center mt-4">
          {!platform.source.isOfficial && (
            <span>
              ※ 권장 규격 기준이며, 최종 통과는 {platform.displayName} 심사에 따릅니다.
            </span>
          )}
        </p>
      </div>
    </Card>
  );
}
