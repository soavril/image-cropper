import type { PlatformSpec } from '@/types';

export const jobkoreaSpec: PlatformSpec = {
  id: 'jobkorea',
  name: 'jobkorea',
  displayName: '잡코리아',
  maxSizeKB: 500,
  dimensions: {
    width: 400,
    height: 500,
    ratio: '4:5',
    tolerance: 10,
  },
  formats: ['jpg', 'png'],
  recommendedFormat: 'jpg',
  notes: [
    '증명사진 형태 권장',
    '배경은 흰색 또는 밝은 단색',
    '정면 응시, 단정한 복장',
  ],
  keywords: {
    error: [
      '잡코리아 사진 업로드 안됨',
      '잡코리아 사진 등록 오류',
      '잡코리아 사진 용량 초과',
      '잡코리아 이력서 사진 오류',
    ],
    spec: [
      '잡코리아 증명사진 규격',
      '잡코리아 사진 크기',
      '잡코리아 사진 사이즈',
    ],
  },
};
