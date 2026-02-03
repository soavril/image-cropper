import type { PlatformSpec } from '@/types';

export const idCardSpec: PlatformSpec = {
  id: 'id-card',
  name: 'id-card',
  displayName: '신분증/주민등록증',
  maxSizeKB: 300,
  dimensions: {
    width: 413,
    height: 531,
    ratio: '35:45', // 3.5cm x 4.5cm
    tolerance: 5,
  },
  formats: ['jpg'],
  recommendedFormat: 'jpg',
  notes: [
    '6개월 이내 촬영한 사진',
    '정면 응시',
    '흰색 배경',
  ],
  keywords: {
    error: [
      '신분증 사진 등록 오류',
      '주민등록증 사진 업로드 안됨',
    ],
    spec: [
      '주민등록증 사진 크기',
      '신분증 사진 규격',
    ],
  },
};
