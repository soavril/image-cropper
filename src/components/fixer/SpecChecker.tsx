'use client';

import type { AnalysisResult, AnalysisIssue } from '@/types';
import type { PlatformSpec } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SpecCheckerProps {
  platform: PlatformSpec;
  result: AnalysisResult;
  onFix: () => void;
  isFixing?: boolean;
}

export function SpecChecker({
  platform,
  result,
  onFix,
  isFixing = false,
}: SpecCheckerProps) {
  const passedCount = result.issues.filter((i) => i.passed).length;
  const totalCount = result.issues.length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📋 {platform.displayName} 규격 검사 결과
        </h3>
        <span
          className={cn(
            'text-sm font-medium px-2 py-1 rounded-full',
            result.passed
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          )}
        >
          {passedCount}/{totalCount} 통과
        </span>
      </div>

      {/* Checklist */}
      <div className="space-y-2 mb-6">
        {result.issues.map((issue, index) => (
          <ChecklistItem key={index} issue={issue} />
        ))}
      </div>

      {/* Result Message */}
      {result.passed ? (
        <div className="text-center py-4 bg-green-50 rounded-xl">
          <p className="text-green-700 font-medium">
            ✅ 모든 규격을 충족합니다!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center py-3 bg-amber-50 rounded-xl">
            <p className="text-amber-700">
              ⚠️ {totalCount - passedCount}개 항목이 기준을 충족하지 않습니다
            </p>
          </div>
          <Button
            onClick={onFix}
            disabled={isFixing}
            className="w-full"
            size="lg"
          >
            {isFixing ? '수정 중...' : '🔧 자동 수정하기'}
          </Button>
        </div>
      )}
    </Card>
  );
}

function ChecklistItem({ issue }: { issue: AnalysisIssue }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg',
        issue.passed ? 'bg-gray-50' : 'bg-red-50'
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{issue.passed ? '✅' : '❌'}</span>
        <span className={cn('font-medium', !issue.passed && 'text-red-700')}>
          {issue.label}
        </span>
      </div>
      <div className="text-right text-sm">
        <span className={cn(!issue.passed && 'text-red-600 font-medium')}>
          {issue.current}
        </span>
        {!issue.passed && (
          <span className="text-gray-400 ml-2">
            (기준: {issue.required})
          </span>
        )}
      </div>
    </div>
  );
}
