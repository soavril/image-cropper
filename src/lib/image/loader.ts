/**
 * 이미지 로더 - EXIF orientation 처리 포함
 */

import type { ImageData } from '@/types';

/**
 * 파일에서 이미지를 로드하고 EXIF orientation을 처리합니다.
 */
export async function loadImage(file: File): Promise<ImageData> {
  // 1. EXIF orientation 추출
  const orientation = await getExifOrientation(file);

  // 2. 이미지 비트맵 생성
  const img = await createImageBitmap(file);

  // 3. Canvas 생성 및 orientation 적용
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const { width, height } = applyOrientation(canvas, ctx, img, orientation);

  // 4. 이미지 그리기
  ctx.drawImage(img, 0, 0);

  // 5. 포맷 감지
  const format = file.type === 'image/png' ? 'png' : 'jpg';

  return {
    canvas,
    originalFile: file,
    originalDimensions: { width, height },
    currentDimensions: { width, height },
    format,
    sizeBytes: file.size,
    orientation,
  };
}

/**
 * EXIF orientation 값을 추출합니다.
 * EXIF 데이터에서 orientation 태그(0x0112)를 읽습니다.
 */
export async function getExifOrientation(file: File): Promise<number> {
  // JPEG 파일만 EXIF 처리
  if (file.type !== 'image/jpeg') {
    return 1;
  }

  try {
    const buffer = await file.slice(0, 65536).arrayBuffer();
    const view = new DataView(buffer);

    // JPEG SOI 마커 확인
    if (view.getUint16(0, false) !== 0xffd8) {
      return 1;
    }

    let offset = 2;
    const length = view.byteLength;

    while (offset < length) {
      if (offset + 2 > length) break;

      const marker = view.getUint16(offset, false);
      offset += 2;

      // APP1 마커 (EXIF)
      if (marker === 0xffe1) {
        if (offset + 2 > length) break;

        const exifLength = view.getUint16(offset, false);
        offset += 2;

        // "Exif\0\0" 확인
        if (offset + 6 > length) break;
        const exifHeader = String.fromCharCode(
          view.getUint8(offset),
          view.getUint8(offset + 1),
          view.getUint8(offset + 2),
          view.getUint8(offset + 3)
        );

        if (exifHeader !== 'Exif') {
          return 1;
        }

        offset += 6; // "Exif\0\0"

        const tiffOffset = offset;

        // TIFF 헤더 (little or big endian)
        if (offset + 2 > length) break;
        const littleEndian = view.getUint16(offset, false) === 0x4949;
        offset += 2;

        // TIFF 매직 넘버
        offset += 2;

        // IFD0 오프셋
        if (offset + 4 > length) break;
        const ifd0Offset = view.getUint32(offset, littleEndian);
        offset = tiffOffset + ifd0Offset;

        // IFD0 엔트리 수
        if (offset + 2 > length) break;
        const numEntries = view.getUint16(offset, littleEndian);
        offset += 2;

        // 각 엔트리 검색
        for (let i = 0; i < numEntries; i++) {
          if (offset + 12 > length) break;

          const tag = view.getUint16(offset, littleEndian);

          // Orientation 태그 (0x0112)
          if (tag === 0x0112) {
            const orientation = view.getUint16(offset + 8, littleEndian);
            return orientation >= 1 && orientation <= 8 ? orientation : 1;
          }

          offset += 12;
        }

        return 1;
      } else if ((marker & 0xff00) === 0xff00) {
        // 다른 마커는 스킵
        if (offset + 2 > length) break;
        const segmentLength = view.getUint16(offset, false);
        offset += segmentLength;
      } else {
        break;
      }
    }

    return 1;
  } catch {
    return 1;
  }
}

/**
 * Canvas에 orientation을 적용합니다.
 *
 * Orientation 값:
 * 1: 정상
 * 2: 좌우 반전
 * 3: 180도 회전
 * 4: 상하 반전
 * 5: 90도 시계방향 + 좌우 반전
 * 6: 90도 시계방향
 * 7: 90도 반시계방향 + 좌우 반전
 * 8: 90도 반시계방향
 */
export function applyOrientation(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: ImageBitmap,
  orientation: number
): { width: number; height: number } {
  const { width, height } = img;

  // orientation 5-8은 width/height가 바뀜
  if (orientation >= 5 && orientation <= 8) {
    canvas.width = height;
    canvas.height = width;
  } else {
    canvas.width = width;
    canvas.height = height;
  }

  // 변환 적용
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    default:
      // orientation 1 또는 알 수 없는 값
      break;
  }

  return { width: canvas.width, height: canvas.height };
}

/**
 * Canvas를 복제합니다.
 */
export function cloneCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const clone = document.createElement('canvas');
  clone.width = source.width;
  clone.height = source.height;
  const ctx = clone.getContext('2d')!;
  ctx.drawImage(source, 0, 0);
  return clone;
}
