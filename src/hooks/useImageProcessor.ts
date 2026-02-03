'use client';

import { useState, useCallback } from 'react';
import type { ImageData, AnalysisResult, FixResult, ProcessingStatus } from '@/types';
import type { PlatformSpec } from '@/types';
import type { CropArea } from '@/components/fixer/ManualFrameEditor';
import { loadAndAnalyze, fixImage, fixImageWithCropArea } from '@/lib/image/pipeline';

/**
 * Phase 1 + 1.5 플로우:
 *
 * 1. upload() → 분석 + 자동 조정 (한 번에)
 * 2. 결과 미리보기 (PassFailChecklist)
 * 3. 사용자 선택:
 *    - "다운로드" → 완료
 *    - "직접 조정" → ManualFrameEditor → fixWithManualCrop()
 */

interface UseImageProcessorReturn {
  // 상태
  status: ProcessingStatus;
  image: ImageData | null;
  analysis: AnalysisResult | null;
  fixResult: FixResult | null;
  blob: Blob | null;
  error: string | null;

  // 액션
  upload: (file: File, platform: PlatformSpec) => Promise<void>;
  fixWithManualCrop: (platform: PlatformSpec, cropArea: CropArea) => Promise<void>;
  reset: () => void;
}

export function useImageProcessor(): UseImageProcessorReturn {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [image, setImage] = useState<ImageData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [fixResult, setFixResult] = useState<FixResult | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Phase 1: 업로드 → 분석 → 자동 조정 (한 번에 처리)
   * "3초 해결" 약속을 지키기 위해 분석과 조정을 연속 실행
   */
  const upload = useCallback(async (file: File, platform: PlatformSpec) => {
    setStatus('analyzing');
    setError(null);
    setFixResult(null);
    setBlob(null);

    try {
      // Step 1: 로드 + 분석
      const { image: loadedImage, analysis: analysisResult } = await loadAndAnalyze(
        file,
        platform
      );

      setImage(loadedImage);
      setAnalysis(analysisResult);

      // Step 2: 자동 조정 (바로 실행)
      setStatus('fixing');

      const { result, blob: fixedBlob } = await fixImage(
        loadedImage,
        platform,
        analysisResult
      );

      setFixResult(result);
      setBlob(fixedBlob);
      setStatus('done');

    } catch (err) {
      console.error('Processing failed:', err);
      setError(err instanceof Error ? err.message : '이미지 처리 중 오류가 발생했습니다.');
      setStatus('error');
    }
  }, []);

  /**
   * Phase 1.5: 수동 크롭 영역으로 재조정
   * ManualFrameEditor에서 사용자가 지정한 영역 적용
   */
  const fixWithManualCrop = useCallback(async (
    platform: PlatformSpec,
    cropArea: CropArea
  ) => {
    if (!image) {
      setError('이미지가 로드되지 않았습니다.');
      return;
    }

    setStatus('fixing');
    setError(null);

    try {
      const { result, blob: fixedBlob } = await fixImageWithCropArea(
        image,
        platform,
        cropArea
      );

      setFixResult(result);
      setBlob(fixedBlob);
      setStatus('done');

    } catch (err) {
      console.error('Manual fix failed:', err);
      setError(err instanceof Error ? err.message : '이미지 수정 중 오류가 발생했습니다.');
      setStatus('error');
    }
  }, [image]);

  /**
   * 리셋: 처음 상태로 돌아감
   */
  const reset = useCallback(() => {
    setStatus('idle');
    setImage(null);
    setAnalysis(null);
    setFixResult(null);
    setBlob(null);
    setError(null);
  }, []);

  return {
    status,
    image,
    analysis,
    fixResult,
    blob,
    error,
    upload,
    fixWithManualCrop,
    reset,
  };
}
