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
    '정면 응시, 자연스러운 표정',
    '흰색 배경',
    '머리카락이 눈썹을 가리지 않아야 함',
    '귀가 보이도록 촬영 권장',
  ],
  keywords: {
    error: [
      '신분증 사진 등록 오류',
      '주민등록증 사진 업로드 안됨',
      '신분증 사진 용량 초과',
      '주민등록증 사진 규격 오류',
    ],
    spec: [
      '주민등록증 사진 크기',
      '신분증 사진 규격',
      '주민등록증 사진 규격 2026',
      '신분증 증명사진 사이즈',
      '주민등록증 사진 픽셀',
    ],
  },
  source: {
    name: '정부24 주민등록증 발급 안내',
    url: 'https://www.gov.kr',
    lastVerified: '2026-02',
    isEstimate: false, // 공식 규격: 3.5cm x 4.5cm
  },
};
