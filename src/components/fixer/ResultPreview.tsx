'use client';

import type { FixResult, FixChange } from '@/types';
import { Card } from '@/components/ui/Card';
import { formatBytes, formatDimensions } from '@/lib/utils/format';
import { useEffect, useRef } from 'react';

interface ResultPreviewProps {
  result: FixResult;
}

/**
 * 결과 미리보기 컴포넌트
 *
 * 핵심 원칙:
 * - "통과 보장" 표현 금지
 * - 실제 출력 파일 크기 명확히 표시
 * - 적용된 변경사항 투명하게 안내
 */
export function ResultPreview({ result }: ResultPreviewProps) {
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Draw before image
    if (beforeCanvasRef.current && result.original.canvas) {
      const ctx = beforeCanvasRef.current.getContext('2d');
      if (ctx) {
        const scale = Math.min(
          150 / result.original.canvas.width,
          150 / result.original.canvas.height
        );
        beforeCanvasRef.current.width = result.original.canvas.width * scale;
        beforeCanvasRef.current.height = result.original.canvas.height * scale;
        ctx.drawImage(
          result.original.canvas,
          0,
          0,
          beforeCanvasRef.current.width,
          beforeCanvasRef.current.height
        );
      }
    }

    // Draw after image
    if (afterCanvasRef.current && result.fixed.canvas) {
      const ctx = afterCanvasRef.current.getContext('2d');
      if (ctx) {
        const scale = Math.min(
          150 / result.fixed.canvas.width,
          150 / result.fixed.canvas.height
        );
        afterCanvasRef.current.width = result.fixed.canvas.width * scale;
        afterCanvasRef.current.height = result.fixed.canvas.height * scale;
        ctx.drawImage(
          result.fixed.canvas,
          0,
          0,
          afterCanvasRef.current.width,
          afterCanvasRef.current.height
        );
      }
    }
  }, [result]);

  const sizeReduction = Math.round(
    ((result.original.sizeBytes - result.fixed.sizeBytes) /
      result.original.sizeBytes) *
      100
  );

  return (
    <Card>
      {/* 결과 메시지 - 보장 표현 없이 */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
          ✅ 권장 규격에 맞게 조정되었습니다
        </span>
      </div>

      {/* Before/After Comparison - 실제 크기 명시 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Before */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">변환 전</p>
          <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center min-h-[160px]">
            <canvas
              ref={beforeCanvasRef}
              className="max-w-full max-h-[150px] rounded"
            />
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium text-gray-700">
              {formatBytes(result.original.sizeBytes)}
            </p>
            <p className="text-xs text-gray-400">
              {formatDimensions(
                result.original.currentDimensions.width,
                result.original.currentDimensions.height
              )}
            </p>
          </div>
        </div>

        {/* After */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">변환 후</p>
          <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-center min-h-[160px] border-2 border-blue-200">
            <canvas
              ref={afterCanvasRef}
              className="max-w-full max-h-[150px] rounded"
            />
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-sm font-bold text-blue-600">
              {formatBytes(result.fixed.sizeBytes)}
            </p>
            <p className="text-xs text-blue-500">
              {formatDimensions(
                result.fixed.currentDimensions.width,
                result.fixed.currentDimensions.height
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Applied Changes Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <h4 className="font-medium text-gray-900 mb-3">적용된 변경사항</h4>
        <ul className="space-y-2 text-sm">
          {result.changes.map((change, index) => (
            <ChangeItem key={index} change={change} />
          ))}
          {sizeReduction > 0 && (
            <li className="flex items-center gap-2 text-green-600">
              <span>✓</span>
              <span>파일 크기 {sizeReduction}% 감소</span>
            </li>
          )}
        </ul>
      </div>

      {/* 출력 파일 정보 강조 */}
      <div className="bg-blue-50 rounded-xl p-4 text-center">
        <p className="text-sm text-blue-800 mb-1">최종 출력 파일</p>
        <p className="text-2xl font-bold text-blue-600">
          {formatBytes(result.fixed.sizeBytes)}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          {result.fixed.currentDimensions.width} × {result.fixed.currentDimensions.height} px
        </p>
      </div>

      {/* 안내 메시지 */}
      <p className="text-xs text-gray-400 text-center mt-4">
        최종 업로드 결과는 각 플랫폼의 심사 기준에 따릅니다
      </p>
    </Card>
  );
}

function ChangeItem({ change }: { change: FixChange }) {
  return (
    <li className="flex items-center gap-2 text-gray-600">
      <span className="text-green-500">✓</span>
      <span>{change.description}</span>
      <span className="text-gray-400 text-xs">
        ({change.before} → {change.after})
      </span>
    </li>
  );
}
