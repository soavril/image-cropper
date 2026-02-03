/**
 * 플랫폼별 사진 규격 설정
 *
 * 원칙:
 * - 확실한 정보만 "공식"으로 표시
 * - 불확실한 정보는 "권장"으로 표시
 * - 픽셀 크기는 물리 크기(cm) × 300dpi로 계산
 */

export interface PlatformConfig {
  id: string;
  name: string;
  displayName: string;
  emoji: string;

  // 물리적 규격 (확실한 정보)
  physicalSize: {
    width: number;    // cm
    height: number;   // cm
  };

  // 픽셀 규격
  pixelSize: {
    width: number;
    height: number;
    isOfficial: boolean;  // false = "권장"
  };

  // 용량 제한
  maxSizeKB: number;
  isMaxSizeOfficial: boolean;

  // 비율 (width:height)
  aspectRatio: string;

  // 포맷
  formats: ('jpg' | 'png')[];
  recommendedFormat: 'jpg' | 'png';

  // 주의사항
  notes: string[];

  // 출처 정보
  source: {
    name: string;
    url: string | null;
    isOfficial: boolean;
  };

  // 안내 메시지
  platformNote: string | null;
}

/**
 * 3.5cm × 4.5cm @ 300dpi = 413 × 531 px
 * 3cm × 4cm @ 300dpi = 354 × 472 px
 */
const CM_TO_PX_300DPI = 118.11;

export const platformConfigs: Record<string, PlatformConfig> = {
  'drivers-license': {
    id: 'drivers-license',
    name: 'drivers-license',
    displayName: '운전면허증',
    emoji: '🚗',
    physicalSize: { width: 3.5, height: 4.5 },
    pixelSize: {
      width: Math.round(3.5 * CM_TO_PX_300DPI),  // 413
      height: Math.round(4.5 * CM_TO_PX_300DPI), // 531
      isOfficial: true,
    },
    maxSizeKB: 500,
    isMaxSizeOfficial: false,
    aspectRatio: '35:45',
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
    source: {
      name: '경찰청 운전면허시험관리단',
      url: 'https://www.safedriving.or.kr',
      isOfficial: true,
    },
    platformNote: '여권용으로 촬영한 사진을 그대로 사용할 수 있습니다.',
  },

  'id-card': {
    id: 'id-card',
    name: 'id-card',
    displayName: '주민등록증',
    emoji: '🪪',
    physicalSize: { width: 3.5, height: 4.5 },
    pixelSize: {
      width: Math.round(3.5 * CM_TO_PX_300DPI),
      height: Math.round(4.5 * CM_TO_PX_300DPI),
      isOfficial: true,
    },
    maxSizeKB: 500,
    isMaxSizeOfficial: false,
    aspectRatio: '35:45',
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
    source: {
      name: '정부24',
      url: 'https://www.gov.kr',
      isOfficial: true,
    },
    platformNote: '여권용으로 촬영한 사진을 그대로 사용할 수 있습니다.',
  },

  'jobkorea': {
    id: 'jobkorea',
    name: 'jobkorea',
    displayName: '잡코리아',
    emoji: '💼',
    physicalSize: { width: 3, height: 4 },
    pixelSize: {
      width: Math.round(3 * CM_TO_PX_300DPI),  // 354
      height: Math.round(4 * CM_TO_PX_300DPI), // 472
      isOfficial: false,  // 권장
    },
    maxSizeKB: 500,
    isMaxSizeOfficial: false,
    aspectRatio: '3:4',
    formats: ['jpg', 'png'],
    recommendedFormat: 'jpg',
    notes: [
      '범용 이력서 사진 규격 (3cm × 4cm) 기준',
      '플랫폼별 픽셀/용량 제한은 다를 수 있음',
      '증명사진 형태 권장',
      '단정한 복장, 밝은 배경',
      '최근 6개월 이내 촬영 권장',
    ],
    source: {
      name: '일반 이력서 사진 규격',
      url: null,
      isOfficial: false,
    },
    platformNote: '정확한 규격은 잡코리아 공식 안내를 확인하세요. 업로드 실패 시 용량을 더 줄여보세요.',
  },

  'saramin': {
    id: 'saramin',
    name: 'saramin',
    displayName: '사람인',
    emoji: '👔',
    physicalSize: { width: 3, height: 4 },
    pixelSize: {
      width: Math.round(3 * CM_TO_PX_300DPI),
      height: Math.round(4 * CM_TO_PX_300DPI),
      isOfficial: false,
    },
    maxSizeKB: 500,
    isMaxSizeOfficial: false,
    aspectRatio: '3:4',
    formats: ['jpg', 'png'],
    recommendedFormat: 'jpg',
    notes: [
      '범용 이력서 사진 규격 (3cm × 4cm) 기준',
      '플랫폼별 픽셀/용량 제한은 다를 수 있음',
      '증명사진 형태 권장',
      '단정한 복장, 밝은 배경',
      '최근 6개월 이내 촬영 권장',
    ],
    source: {
      name: '일반 이력서 사진 규격',
      url: null,
      isOfficial: false,
    },
    platformNote: '정확한 규격은 사람인 공식 안내를 확인하세요. 업로드 실패 시 용량을 더 줄여보세요.',
  },
};

// Helper functions
export function getPlatformConfig(id: string): PlatformConfig | undefined {
  return platformConfigs[id];
}

export function getAllPlatformConfigs(): PlatformConfig[] {
  return Object.values(platformConfigs);
}

export type PlatformId = keyof typeof platformConfigs;
