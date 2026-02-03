/**
 * 이미지 처리 파이프라인
 * 전체 처리 흐름을 조율합니다.
 */

import type { ImageData, AnalysisResult, FixResult, FixChange } from '@/types';
import type { PlatformSpec } from '@/types';
import { loadImage, cloneCanvas } from './loader';
import { analyzeImage, getRequiredFixes } from './analyzer';
import { calculatePlatformResize, applyResize, applyMultiStepResize } from './resizer';
import { compressToTargetSize, determineOutputFormat, hasTransparentPixels } from './compressor';
import { formatFileSize } from './exporter';
import { formatDimensions } from '@/lib/utils/format';

/**
 * 파일을 로드하고 분석합니다.
 */
export async function loadAndAnalyze(
  file: File,
  platform: PlatformSpec
): Promise<{ image: ImageData; analysis: AnalysisResult }> {
  const image = await loadImage(file);
  const analysis = analyzeImage(image, platform);

  return { image, analysis };
}

/**
 * 이미지를 플랫폼 규격에 맞춰 수정합니다.
 */
export async function fixImage(
  image: ImageData,
  platform: PlatformSpec,
  analysis: AnalysisResult
): Promise<{ result: FixResult; blob: Blob }> {
  const changes: FixChange[] = [];
  let currentCanvas = cloneCanvas(image.canvas);
  let currentWidth = image.currentDimensions.width;
  let currentHeight = image.currentDimensions.height;

  const requiredFixes = getRequiredFixes(analysis);

  // 1. 크롭 및 리사이즈 (비율 및 크기 조정)
  if (requiredFixes.includes('crop') || requiredFixes.includes('resize')) {
    const resizeResult = calculatePlatformResize(
      { width: currentWidth, height: currentHeight },
      platform
    );

    // 크롭이 필요한 경우
    if (
      resizeResult.cropWidth !== currentWidth ||
      resizeResult.cropHeight !== currentHeight
    ) {
      currentCanvas = applyResize(currentCanvas, resizeResult);

      changes.push({
        type: 'crop',
        description: '비율 조정 (자동 크롭)',
        before: formatDimensions(currentWidth, currentHeight),
        after: formatDimensions(resizeResult.width, resizeResult.height),
      });
    } else {
      // 리사이즈만 필요한 경우
      currentCanvas = applyMultiStepResize(
        currentCanvas,
        resizeResult.width,
        resizeResult.height
      );

      if (
        currentWidth !== resizeResult.width ||
        currentHeight !== resizeResult.height
      ) {
        changes.push({
          type: 'resize',
          description: '해상도 조정',
          before: formatDimensions(currentWidth, currentHeight),
          after: formatDimensions(resizeResult.width, resizeResult.height),
        });
      }
    }

    currentWidth = currentCanvas.width;
    currentHeight = currentCanvas.height;
  }

  // 2. 포맷 결정
  const hasTransparency =
    image.format === 'png' && hasTransparentPixels(image.canvas);
  const outputFormat = determineOutputFormat(
    image.format,
    platform.maxSizeKB,
    hasTransparency
  );

  const originalFormat = image.format;
  const newFormat = outputFormat === 'image/png' ? 'png' : 'jpg';

  if (originalFormat !== newFormat) {
    changes.push({
      type: 'format',
      description: '파일 형식 변환',
      before: originalFormat.toUpperCase(),
      after: newFormat.toUpperCase(),
    });
  }

  // 3. 압축
  const blob = await compressToTargetSize(
    currentCanvas,
    platform.maxSizeKB,
    outputFormat
  );

  // 압축 변경 사항 기록
  if (blob.size < image.sizeBytes) {
    changes.push({
      type: 'compress',
      description: '파일 크기 최적화',
      before: formatFileSize(image.sizeBytes),
      after: formatFileSize(blob.size),
    });
  }

  // 수정된 ImageData 생성
  const fixedImage: ImageData = {
    canvas: currentCanvas,
    originalFile: image.originalFile,
    originalDimensions: image.originalDimensions,
    currentDimensions: { width: currentWidth, height: currentHeight },
    format: newFormat,
    sizeBytes: blob.size,
    orientation: 1, // 이미 보정됨
  };

  const result: FixResult = {
    original: image,
    fixed: fixedImage,
    changes,
  };

  return { result, blob };
}

/**
 * 전체 처리 파이프라인을 실행합니다.
 */
export async function processImage(
  file: File,
  platform: PlatformSpec
): Promise<{
  image: ImageData;
  analysis: AnalysisResult;
  fixResult?: FixResult;
  blob?: Blob;
}> {
  // 1. 로드 및 분석
  const { image, analysis } = await loadAndAnalyze(file, platform);

  // 2. 이미 통과하면 수정 불필요
  if (analysis.passed) {
    // 그래도 Blob 생성 (다운로드용)
    const outputFormat = determineOutputFormat(
      image.format,
      platform.maxSizeKB,
      false
    );
    const blob = await compressToTargetSize(
      image.canvas,
      platform.maxSizeKB,
      outputFormat
    );

    return { image, analysis, blob };
  }

  // 3. 수정
  const { result: fixResult, blob } = await fixImage(image, platform, analysis);

  return { image, analysis, fixResult, blob };
}

/**
 * 빠른 분석만 수행 (수정 없이)
 */
export async function quickAnalyze(
  file: File,
  platform: PlatformSpec
): Promise<{ image: ImageData; analysis: AnalysisResult }> {
  return loadAndAnalyze(file, platform);
}
