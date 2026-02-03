/**
 * 플랫폼 설정 통합 export
 *
 * 두 가지 설정 시스템 지원:
 * 1. PlatformConfig (신규) - 상세 설정 with 공식/권장 구분
 * 2. PlatformSpec (기존) - 하위 호환성 유지
 */

import type { PlatformSpec, PlatformId } from '@/types';
import { platformConfigs, type PlatformConfig } from './config';

// PlatformConfig를 PlatformSpec으로 변환 (하위 호환성)
function configToSpec(config: PlatformConfig): PlatformSpec {
  return {
    id: config.id,
    name: config.name,
    displayName: config.displayName,
    maxSizeKB: config.maxSizeKB,
    dimensions: {
      width: config.pixelSize.width,
      height: config.pixelSize.height,
      ratio: config.aspectRatio,
      tolerance: 10,
    },
    formats: config.formats,
    recommendedFormat: config.recommendedFormat,
    notes: config.notes,
    keywords: {
      error: [],
      spec: [],
    },
    source: {
      name: config.source.name,
      url: config.source.url ?? undefined,
      lastVerified: '2026-02',
      isEstimate: !config.source.isOfficial,
    },
    platformNote: config.platformNote ?? undefined,
  };
}

// PlatformSpec 형태로 export (하위 호환성)
export const platforms: Record<PlatformId, PlatformSpec> = {
  'drivers-license': configToSpec(platformConfigs['drivers-license']),
  'id-card': configToSpec(platformConfigs['id-card']),
  'jobkorea': configToSpec(platformConfigs['jobkorea']),
  'saramin': configToSpec(platformConfigs['saramin']),
};

export function getPlatform(id: string): PlatformSpec | undefined {
  return platforms[id as PlatformId];
}

export function getAllPlatforms(): PlatformSpec[] {
  return Object.values(platforms);
}

export function isPlatformId(id: string): id is PlatformId {
  return id in platforms;
}

// 신규 PlatformConfig export
export { platformConfigs, type PlatformConfig } from './config';
export { getPlatformConfig, getAllPlatformConfigs } from './config';

// 공식 기준 상수
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
    pixels: '약 354 × 472px',
    description: '온라인 이력서 (플랫폼별 상이)',
  },
};
