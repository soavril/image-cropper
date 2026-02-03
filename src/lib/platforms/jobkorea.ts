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
    '최근 6개월 이내 촬영 사진 권장',
  ],
  keywords: {
    error: [
      '잡코리아 사진 업로드 안됨',
      '잡코리아 사진 등록 오류',
      '잡코리아 사진 용량 초과',
      '잡코리아 이력서 사진 오류',
      '잡코리아 사진 파일 형식 오류',
      '잡코리아 이력서 사진 안올라감',
    ],
    spec: [
      '잡코리아 증명사진 규격',
      '잡코리아 사진 크기',
      '잡코리아 사진 사이즈',
      '잡코리아 사진 규격 2026',
      '잡코리아 이력서 사진 크기 KB',
    ],
  },
  source: {
    name: '잡코리아 이력서 작성 가이드',
    url: 'https://www.jobkorea.co.kr',
    lastVerified: '2026-02',
    isEstimate: true, // 공식 API 문서 미공개로 사용자 경험 기반 추정
  },
};
