import type { PlatformSpec } from '@/types';

export const driversLicenseSpec: PlatformSpec = {
  id: 'drivers-license',
  name: 'drivers-license',
  displayName: '운전면허증',
  maxSizeKB: 300,
  dimensions: {
    width: 413,
    height: 531,
    ratio: '35:45', // 3.5cm x 4.5cm (여권사진 규격과 동일)
    tolerance: 5,
  },
  formats: ['jpg'],
  recommendedFormat: 'jpg',
  notes: [
    '6개월 이내 촬영한 사진',
    '정면 응시, 무표정',
    '흰색 또는 밝은 단색 배경',
    '모자, 선글라스 착용 불가',
    '안경 착용 가능 (단, 렌즈 반사 없어야 함)',
  ],
  keywords: {
    error: [
      '운전면허증 사진 업로드 안됨',
      '운전면허 사진 등록 오류',
      '면허증 사진 규격 오류',
      '운전면허 갱신 사진 오류',
      '면허증 사진 용량 초과',
    ],
    spec: [
      '운전면허증 사진 규격',
      '운전면허 사진 크기',
      '면허증 증명사진 사이즈',
      '운전면허증 사진 규격 2026',
      '운전면허 사진 픽셀',
    ],
  },
  source: {
    name: '경찰청 운전면허시험관리단',
    url: 'https://www.safedriving.or.kr',
    lastVerified: '2026-02',
    isEstimate: false, // 공식 규격: 3.5cm x 4.5cm (여권사진 기준)
  },
};
