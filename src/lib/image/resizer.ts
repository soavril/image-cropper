/**
 * 이미지 리사이저 - 스마트 크롭 포함
 *
 * Phase 1.5: 크롭 위치 옵션 지원
 * - 'auto': 얼굴 위치 추정 기반 (기본값)
 * - 'top': 상단 기준
 * - 'center': 중앙 기준
 * - 'bottom': 하단 기준
 */

import type { ResizeResult } from '@/types';
import type { PlatformSpec } from '@/types';
import { parseRatio } from '@/lib/utils/format';

export type CropPosition = 'auto' | 'top' | 'center' | 'bottom';

/**
 * 리사이즈 계산을 수행합니다.
 *
 * @param source 원본 이미지 크기
 * @param target 목표 크기
 * @param strategy 리사이즈 전략 ('fit': 비율 유지하며 맞춤, 'smart-crop': 목표 비율에 맞춰 크롭)
 */
export function calculateResize(
  source: { width: number; height: number },
  target: { width: number; height: number; ratio?: string },
  strategy: 'fit' | 'smart-crop'
): ResizeResult {
  if (strategy === 'fit') {
    return calculateFitResize(source, target);
  }

  return calculateSmartCropResize(source, target);
}

/**
 * 비율을 유지하며 목표 크기 안에 맞추는 리사이즈 계산
 */
function calculateFitResize(
  source: { width: number; height: number },
  target: { width: number; height: number }
): ResizeResult {
  const scale = Math.min(
    target.width / source.width,
    target.height / source.height
  );

  // 원본이 이미 작으면 확대하지 않음
  const finalScale = Math.min(scale, 1);

  return {
    width: Math.round(source.width * finalScale),
    height: Math.round(source.height * finalScale),
    cropX: 0,
    cropY: 0,
    cropWidth: source.width,
    cropHeight: source.height,
  };
}

/**
 * 목표 비율에 맞춰 스마트 크롭 + 리사이즈 계산
 *
 * Phase 1.5: 크롭 위치 옵션 지원
 * @param position 크롭 위치 ('auto' | 'top' | 'center' | 'bottom')
 */
function calculateSmartCropResize(
  source: { width: number; height: number },
  target: { width: number; height: number; ratio?: string },
  position: CropPosition = 'auto'
): ResizeResult {
  const targetRatio = target.ratio
    ? parseRatio(target.ratio)
    : target.width / target.height;
  const sourceRatio = source.width / source.height;

  let cropX = 0;
  let cropY = 0;
  let cropWidth = source.width;
  let cropHeight = source.height;

  if (Math.abs(sourceRatio - targetRatio) > 0.01) {
    if (sourceRatio > targetRatio) {
      // 원본이 더 넓음 → 좌우 크롭 (중앙 기준)
      cropWidth = Math.round(source.height * targetRatio);
      cropX = Math.round((source.width - cropWidth) / 2);
    } else {
      // 원본이 더 높음 → 상하 크롭
      cropHeight = Math.round(source.width / targetRatio);
      const excessHeight = source.height - cropHeight;

      // 크롭 위치에 따른 Y 좌표 계산
      switch (position) {
        case 'top':
          cropY = 0;
          break;
        case 'center':
          cropY = Math.round(excessHeight / 2);
          break;
        case 'bottom':
          cropY = excessHeight;
          break;
        case 'auto':
        default:
          // 얼굴이 보통 상단 1/3 지점에 위치
          // 크롭 시작점을 상단에서 약간 아래로 설정
          cropY = Math.round(excessHeight * 0.2);
          break;
      }
    }
  }

  return {
    width: target.width,
    height: target.height,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
  };
}

/**
 * Canvas에 리사이즈를 적용합니다.
 */
export function applyResize(
  sourceCanvas: HTMLCanvasElement,
  resizeResult: ResizeResult
): HTMLCanvasElement {
  const { width, height, cropX, cropY, cropWidth, cropHeight } = resizeResult;

  const destCanvas = document.createElement('canvas');
  destCanvas.width = width;
  destCanvas.height = height;

  const ctx = destCanvas.getContext('2d')!;

  // 고품질 리사이즈를 위한 설정
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 크롭 영역에서 목표 크기로 그리기
  ctx.drawImage(
    sourceCanvas,
    cropX,
    cropY,
    cropWidth ?? sourceCanvas.width,
    cropHeight ?? sourceCanvas.height,
    0,
    0,
    width,
    height
  );

  return destCanvas;
}

/**
 * 플랫폼 규격에 맞는 리사이즈 결과를 계산합니다.
 *
 * @param position 크롭 위치 (Phase 1.5)
 */
export function calculatePlatformResize(
  source: { width: number; height: number },
  platform: PlatformSpec,
  position: CropPosition = 'auto'
): ResizeResult {
  const target = {
    width: platform.dimensions.width,
    height: platform.dimensions.height,
    ratio: platform.dimensions.ratio,
  };

  return calculateSmartCropResize(source, target, position);
}

/**
 * Phase 1.5: 모든 크롭 위치 옵션의 결과를 미리 계산
 * 사용자에게 3가지 옵션을 보여주기 위함
 */
export function calculateAllCropOptions(
  source: { width: number; height: number },
  platform: PlatformSpec
): Record<CropPosition, ResizeResult> {
  const positions: CropPosition[] = ['top', 'auto', 'bottom'];
  const results: Record<string, ResizeResult> = {};

  for (const pos of positions) {
    results[pos] = calculatePlatformResize(source, platform, pos);
  }

  // center는 참고용으로 추가
  results['center'] = calculatePlatformResize(source, platform, 'center');

  return results as Record<CropPosition, ResizeResult>;
}

/**
 * 리사이즈가 필요한지 확인합니다.
 */
export function needsResize(
  source: { width: number; height: number },
  platform: PlatformSpec
): boolean {
  const targetWidth = platform.dimensions.width;
  const targetHeight = platform.dimensions.height;
  const tolerance = platform.dimensions.tolerance;

  // 크기가 다르거나 비율이 다르면 리사이즈 필요
  const widthDiff = Math.abs(source.width - targetWidth);
  const heightDiff = Math.abs(source.height - targetHeight);

  if (widthDiff > tolerance || heightDiff > tolerance) {
    return true;
  }

  // 비율 체크
  const sourceRatio = source.width / source.height;
  const targetRatio = parseRatio(platform.dimensions.ratio);
  const ratioDiff = Math.abs(sourceRatio - targetRatio) / targetRatio;

  return ratioDiff > 0.05; // 5% 이상 차이나면 리사이즈 필요
}

/**
 * 다단계 리사이즈 (큰 이미지를 점진적으로 줄임)
 * 품질 향상을 위해 50%씩 줄여나감
 */
export function applyMultiStepResize(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  let currentCanvas = sourceCanvas;
  let currentWidth = sourceCanvas.width;
  let currentHeight = sourceCanvas.height;

  // 목표 크기의 2배보다 크면 단계적으로 줄임
  while (currentWidth > targetWidth * 2 || currentHeight > targetHeight * 2) {
    const nextWidth = Math.max(Math.round(currentWidth / 2), targetWidth);
    const nextHeight = Math.max(Math.round(currentHeight / 2), targetHeight);

    const nextCanvas = document.createElement('canvas');
    nextCanvas.width = nextWidth;
    nextCanvas.height = nextHeight;

    const ctx = nextCanvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(currentCanvas, 0, 0, nextWidth, nextHeight);

    currentCanvas = nextCanvas;
    currentWidth = nextWidth;
    currentHeight = nextHeight;
  }

  // 최종 리사이즈
  if (currentWidth !== targetWidth || currentHeight !== targetHeight) {
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = targetWidth;
    finalCanvas.height = targetHeight;

    const ctx = finalCanvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(currentCanvas, 0, 0, targetWidth, targetHeight);

    return finalCanvas;
  }

  return currentCanvas;
}
