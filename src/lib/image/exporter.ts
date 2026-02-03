/**
 * 이미지 내보내기 - 다운로드 처리
 */

import type { PlatformSpec } from '@/types';

/**
 * Blob을 파일로 다운로드합니다.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();

  // 클린업
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * 플랫폼에 맞는 파일명을 생성합니다.
 */
export function generateFilename(
  platform: PlatformSpec,
  format: 'jpg' | 'png' = 'jpg'
): string {
  const timestamp = Date.now();
  const extension = format === 'png' ? 'png' : 'jpg';

  return `${platform.name}_photo_${timestamp}.${extension}`;
}

/**
 * 간단한 파일명 생성 (타임스탬프 없이)
 */
export function generateSimpleFilename(
  platform: PlatformSpec,
  format: 'jpg' | 'png' = 'jpg'
): string {
  const extension = format === 'png' ? 'png' : 'jpg';
  return `${platform.name}_photo_fixed.${extension}`;
}

/**
 * Canvas를 Data URL로 변환합니다.
 */
export function canvasToDataURL(
  canvas: HTMLCanvasElement,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality: number = 0.92
): string {
  return canvas.toDataURL(format, quality);
}

/**
 * Data URL을 Blob으로 변환합니다.
 */
export function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

/**
 * 이미지 미리보기 URL을 생성합니다.
 */
export function createPreviewURL(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/jpeg', 0.8);
}

/**
 * 미리보기 URL을 해제합니다.
 */
export function revokePreviewURL(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * 클립보드에 이미지를 복사합니다.
 */
export async function copyToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        'image/png'
      );
    });

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);

    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
