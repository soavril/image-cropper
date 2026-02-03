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
    '정면 응시, 단정한 복장',
    '최근 6개월 이내 촬영 사진 권장',
  ],
  keywords: {
    error: [
      '사람인 사진 업로드 안됨',
      '사람인 사진 등록 실패',
      '사람인 사진 등록 오류',
      '사람인 사진 용량 초과',
      '사람인 이력서 사진 오류',
      '사람인 사진 파일 형식',
    ],
    spec: [
      '사람인 증명사진 크기',
      '사람인 사진 규격',
      '사람인 사진 사이즈',
      '사람인 사진 규격 2026',
      '사람인 이력서 사진 크기',
    ],
  },
  source: {
    name: '사람인 이력서 작성 가이드',
    url: 'https://www.saramin.co.kr',
    lastVerified: '2026-02',
    isEstimate: true,
  },
};
