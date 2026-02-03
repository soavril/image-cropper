import type { PlatformSpec } from '@/types';

export const saraminSpec: PlatformSpec = {
  id: 'saramin',
  name: 'saramin',
  displayName: '사람인',
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
  ],
  keywords: {
    error: [
      '사람인 사진 업로드 안됨',
      '사람인 사진 등록 실패',
      '사람인 사진 등록 오류',
    ],
    spec: [
      '사람인 증명사진 크기',
      '사람인 사진 규격',
    ],
  },
};
