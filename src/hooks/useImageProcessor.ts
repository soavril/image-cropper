'use client';

import { useState, useCallback } from 'react';
import type { ImageData, AnalysisResult, FixResult, ProcessingStatus } from '@/types';
import type { PlatformSpec } from '@/types';
import { loadAndAnalyze, fixImage } from '@/lib/image/pipeline';

interface UseImageProcessorReturn {
  status: ProcessingStatus;
  image: ImageData | null;
  analysis: AnalysisResult | null;
  fixResult: FixResult | null;
  blob: Blob | null;
  error: string | null;
  upload: (file: File, platform: PlatformSpec) => Promise<void>;
  fix: (platform: PlatformSpec) => Promise<void>;
  reset: () => void;
}

export function useImageProcessor(): UseImageProcessorReturn {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [image, setImage] = useState<ImageData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [fixResult, setFixResult] = useState<FixResult | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File, platform: PlatformSpec) => {
    setStatus('analyzing');
    setError(null);
    setFixResult(null);
    setBlob(null);

    try {
      const { image: loadedImage, analysis: analysisResult } = await loadAndAnalyze(
        file,
        platform
      );

      setImage(loadedImage);
      setAnalysis(analysisResult);
      setStatus('done');
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : '이미지 분석 중 오류가 발생했습니다.');
      setStatus('error');
    }
  }, []);

  const fix = useCallback(async (platform: PlatformSpec) => {
    if (!image || !analysis) {
      setError('이미지가 로드되지 않았습니다.');
      return;
    }

    setStatus('fixing');
    setError(null);

    try {
      const { result, blob: fixedBlob } = await fixImage(image, platform, analysis);

      setFixResult(result);
      setBlob(fixedBlob);
      setStatus('done');
    } catch (err) {
      console.error('Fix failed:', err);
      setError(err instanceof Error ? err.message : '이미지 수정 중 오류가 발생했습니다.');
      setStatus('error');
    }
  }, [image, analysis]);

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
    fix,
    reset,
  };
}
