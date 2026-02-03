/**
 * 이미지 압축기 - Binary search 알고리즘
 */

import { imageConfig } from '@/lib/config';

/**
 * 목표 용량에 맞춰 이미지를 압축합니다.
 * Binary search를 사용하여 최적의 품질을 찾습니다.
 */
export async function compressToTargetSize(
  canvas: HTMLCanvasElement,
  targetSizeKB: number,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg'
): Promise<Blob> {
  const targetBytes = targetSizeKB * 1024;

  // PNG는 품질 조절이 안되므로, 먼저 PNG로 시도하고 크면 JPEG로 변환
  if (format === 'image/png') {
    const pngBlob = await canvasToBlob(canvas, 'image/png', 1);

    if (pngBlob.size <= targetBytes) {
      return pngBlob;
    }

    // PNG가 너무 크면 JPEG로 변환
    console.log(
      `PNG size (${Math.round(pngBlob.size / 1024)}KB) exceeds target, converting to JPEG`
    );
    format = 'image/jpeg';
  }

  // 먼저 최고 품질로 시도
  const highQualityBlob = await canvasToBlob(
    canvas,
    format,
    imageConfig.maxQuality
  );

  if (highQualityBlob.size <= targetBytes) {
    return highQualityBlob;
  }

  // Binary search로 최적 품질 찾기
  let minQuality = imageConfig.minQuality;
  let maxQuality = imageConfig.maxQuality;
  let bestBlob: Blob = highQualityBlob;
  let bestQuality = imageConfig.maxQuality;

  const maxIterations = imageConfig.compressionIterations;

  for (let i = 0; i < maxIterations; i++) {
    const midQuality = (minQuality + maxQuality) / 2;
    const blob = await canvasToBlob(canvas, format, midQuality);

    if (blob.size <= targetBytes) {
      // 목표 이하이면 품질을 올려볼 수 있음
      bestBlob = blob;
      bestQuality = midQuality;
      minQuality = midQuality;
    } else {
      // 목표 초과이면 품질을 낮춰야 함
      maxQuality = midQuality;
    }

    // 충분히 가까우면 종료 (목표의 5% 이내)
    if (
      blob.size <= targetBytes &&
      blob.size >= targetBytes * 0.9
    ) {
      return blob;
    }

    // 품질 범위가 너무 좁아지면 종료
    if (maxQuality - minQuality < 0.01) {
      break;
    }
  }

  // 최소 품질로도 목표를 맞출 수 없으면 리사이즈 필요
  if (bestBlob.size > targetBytes) {
    console.warn(
      `Cannot reach target size. Best: ${Math.round(bestBlob.size / 1024)}KB, Target: ${targetSizeKB}KB`
    );

    // 추가 압축 시도: 캔버스 크기 축소
    const scaledBlob = await compressWithScaling(
      canvas,
      targetSizeKB,
      format,
      bestQuality
    );

    if (scaledBlob) {
      return scaledBlob;
    }
  }

  return bestBlob;
}

/**
 * 캔버스 크기를 줄여가며 압축 시도
 */
async function compressWithScaling(
  canvas: HTMLCanvasElement,
  targetSizeKB: number,
  format: 'image/jpeg' | 'image/png',
  quality: number
): Promise<Blob | null> {
  const targetBytes = targetSizeKB * 1024;
  let scale = 0.95;

  for (let i = 0; i < 5; i++) {
    const scaledWidth = Math.round(canvas.width * scale);
    const scaledHeight = Math.round(canvas.height * scale);

    // 너무 작아지면 중단
    if (scaledWidth < 100 || scaledHeight < 100) {
      break;
    }

    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = scaledWidth;
    scaledCanvas.height = scaledHeight;

    const ctx = scaledCanvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight);

    const blob = await canvasToBlob(scaledCanvas, format, quality);

    if (blob.size <= targetBytes) {
      return blob;
    }

    scale *= 0.9;
  }

  return null;
}

/**
 * Canvas를 Blob으로 변환합니다.
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      type,
      quality
    );
  });
}

/**
 * 최적의 출력 포맷을 결정합니다.
 */
export function determineOutputFormat(
  originalFormat: 'jpg' | 'png',
  targetSizeKB: number,
  hasTransparency: boolean = false
): 'image/jpeg' | 'image/png' {
  // 투명도가 있으면 PNG 유지
  if (hasTransparency) {
    return 'image/png';
  }

  // 타겟 용량이 작으면 JPEG 권장 (더 효율적)
  if (targetSizeKB <= 300) {
    return 'image/jpeg';
  }

  // 원본 포맷 유지
  return originalFormat === 'png' ? 'image/png' : 'image/jpeg';
}

/**
 * 이미지에 투명 픽셀이 있는지 확인합니다.
 */
export function hasTransparentPixels(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 알파 채널(4번째 값) 확인
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) {
      return true;
    }
  }

  return false;
}

/**
 * 예상 압축 크기를 계산합니다 (대략적인 추정)
 */
export function estimateCompressedSize(
  canvas: HTMLCanvasElement,
  quality: number
): number {
  // 대략적인 추정: 픽셀 수 * 품질 계수
  const pixels = canvas.width * canvas.height;
  const bytesPerPixel = 0.1 + quality * 0.15; // JPEG 기준 대략적인 계수

  return Math.round(pixels * bytesPerPixel);
}
