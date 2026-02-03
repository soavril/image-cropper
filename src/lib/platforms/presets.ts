/**
 * 플랫폼별 권장 규격 프리셋
 *
 * 주의: 이 값들은 "권장" 규격이며, 실제 플랫폼 요구사항은 변경될 수 있습니다.
 * 정확한 규격은 각 플랫폼의 공식 안내를 확인하세요.
 */

import type { PlatformSpec } from '@/types';

/**
 * 공식 기준 참고:
 * - 운전면허증/주민등록증: 3.5cm x 4.5cm (여권사진 규격)
 * - 이력서 사진(오프라인): 3cm x 4cm
 * - 이력서 사진(온라인): 플랫폼마다 픽셀/용량 제한 상이
 */

// 3.5cm x 4.5cm @ 300dpi = 413 x 531 px
const PASSPORT_STANDARD = {
  width: 413,
  height: 531,
  ratio: '35:45',
  physicalSize: '3.5cm × 4.5cm',
};

// 3cm x 4cm @ 300dpi = 354 x 472 px
const RESUME_STANDARD_OFFLINE = {
  width: 354,
  height: 472,
  ratio: '3:4',
  physicalSize: '3cm × 4cm',
};

// 온라인 이력서 - 일반적인 웹 최적화 크기
const RESUME_STANDARD_ONLINE = {
  width: 400,
  height: 500,
  ratio: '4:5',
  physicalSize: '웹 최적화',
};

export const jobkoreaSpec: PlatformSpec = {
  id: 'jobkorea',
  name: 'jobkorea',
  displayName: '잡코리아',
  // 권장 최대 용량 (실제 제한은 플랫폼에 따라 다를 수 있음)
  maxSizeKB: 500,
  dimensions: {
    ...RESUME_STANDARD_ONLINE,
    tolerance: 20, // 넓은 허용 오차
  },
  formats: ['jpg', 'png'],
  recommendedFormat: 'jpg',
  notes: [
    '증명사진 형태 권장',
    '배경은 흰색 또는 밝은 단색',
    '정면 응시, 단정한 복장',
    '최근 6개월 이내 촬영 권장',
  ],
  keywords: {
    error: [
      '잡코리아 사진 업로드 안됨',
      '잡코리아 사진 등록 오류',
      '잡코리아 이력서 사진 오류',
    ],
    spec: [
      '잡코리아 증명사진 규격',
      '잡코리아 사진 크기',
      '잡코리아 이력서 사진',
    ],
  },
  source: {
    name: '잡코리아 이력서 작성 도움말',
    url: 'https://www.jobkorea.co.kr',
    lastVerified: '2026-02',
    isEstimate: true,
  },
  // 추가: 플랫폼별 안내 메시지
  platformNote: '온라인 이력서의 경우 플랫폼마다 픽셀/용량 제한이 다를 수 있습니다. 업로드 실패 시 용량을 더 줄여보세요.',
};

export const saraminSpec: PlatformSpec = {
  id: 'saramin',
  name: 'saramin',
  displayName: '사람인',
  maxSizeKB: 500,
  dimensions: {
    ...RESUME_STANDARD_ONLINE,
    tolerance: 20,
  },
  formats: ['jpg', 'png'],
  recommendedFormat: 'jpg',
  notes: [
    '증명사진 형태 권장',
    '배경은 흰색 또는 밝은 단색',
    '정면 응시, 단정한 복장',
    '최근 6개월 이내 촬영 권장',
  ],
  keywords: {
    error: [
      '사람인 사진 업로드 안됨',
      '사람인 사진 등록 실패',
      '사람인 이력서 사진 오류',
    ],
    spec: [
      '사람인 증명사진 크기',
      '사람인 사진 규격',
      '사람인 이력서 사진',
    ],
  },
  source: {
    name: '사람인 이력서 작성 도움말',
    url: 'https://www.saramin.co.kr',
    lastVerified: '2026-02',
    isEstimate: true,
  },
  platformNote: '온라인 이력서의 경우 플랫폼마다 픽셀/용량 제한이 다를 수 있습니다. 업로드 실패 시 용량을 더 줄여보세요.',
};

export const driversLicenseSpec: PlatformSpec = {
  id: 'drivers-license',
  name: 'drivers-license',
  displayName: '운전면허증',
  maxSizeKB: 500, // 웹 업로드 시 권장
  dimensions: {
    ...PASSPORT_STANDARD,
    tolerance: 10,
  },
  formats: ['jpg'],
  recommendedFormat: 'jpg',
  notes: [
    '여권사진 규격과 동일 (3.5cm × 4.5cm)',
    '6개월 이내 촬영한 천연색 사진',
    '정면 응시, 무표정 또는 자연스러운 표정',
    '흰색 또는 밝은 단색 배경',
    '모자, 선글라스 착용 불가',
    '안경 착용 가능 (렌즈 반사 없어야 함)',
  ],
  keywords: {
    error: [
      '운전면허증 사진 업로드 안됨',
      '운전면허 사진 등록 오류',
      '면허증 사진 규격 오류',
    ],
    spec: [
      '운전면허증 사진 규격',
      '운전면허 사진 크기',
      '면허증 증명사진',
    ],
  },
  source: {
    name: '경찰청 운전면허시험관리단',
    url: 'https://www.safedriving.or.kr',
    lastVerified: '2026-02',
    isEstimate: false,
  },
  platformNote: '운전면허증 사진은 여권사진 규격(3.5cm × 4.5cm)과 동일합니다. 여권용으로 촬영한 사진을 사용할 수 있습니다.',
};

export const idCardSpec: PlatformSpec = {
  id: 'id-card',
  name: 'id-card',
  displayName: '주민등록증',
  maxSizeKB: 500,
  dimensions: {
    ...PASSPORT_STANDARD,
    tolerance: 10,
  },
  formats: ['jpg'],
  recommendedFormat: 'jpg',
  notes: [
    '여권사진 규격과 동일 (3.5cm × 4.5cm)',
    '6개월 이내 촬영한 천연색 사진',
    '정면 응시, 자연스러운 표정',
    '흰색 배경',
    '모자, 선글라스, 안대 착용 불가',
    '머리카락이 눈썹을 가리지 않아야 함',
  ],
  keywords: {
    error: [
      '주민등록증 사진 업로드 안됨',
      '신분증 사진 등록 오류',
    ],
    spec: [
      '주민등록증 사진 크기',
      '신분증 사진 규격',
      '주민등록증 증명사진',
    ],
  },
  source: {
    name: '정부24 주민등록증 발급 안내',
    url: 'https://www.gov.kr',
    lastVerified: '2026-02',
    isEstimate: false,
  },
  platformNote: '주민등록증 사진은 여권사진 규격(3.5cm × 4.5cm)을 사용합니다. 여권용으로 촬영한 사진을 그대로 사용할 수 있습니다.',
};

/**
 * 공식 기준 상수 (Phase 2 확장용)
 */
export const OFFICIAL_STANDARDS = {
  passport: {
    physical: '3.5cm × 4.5cm',
    pixels: '413 × 531px (300dpi)',
    description: '여권, 운전면허증, 주민등록증 공통 규격',
  },
  resumeOffline: {
    physical: '3cm × 4cm',
    pixels: '354 × 472px (300dpi)',
    description: '오프라인 이력서 제출용',
  },
  resumeOnline: {
    physical: '웹 최적화',
    pixels: '약 400 × 500px',
    description: '온라인 이력서 (플랫폼별 상이)',
  },
};
