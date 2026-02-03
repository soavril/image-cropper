import type { PlatformSpec, PlatformId } from '@/types';
import {
  jobkoreaSpec,
  saraminSpec,
  driversLicenseSpec,
  idCardSpec,
  OFFICIAL_STANDARDS,
} from './presets';

export const platforms: Record<PlatformId, PlatformSpec> = {
  jobkorea: jobkoreaSpec,
  saramin: saraminSpec,
  'drivers-license': driversLicenseSpec,
  'id-card': idCardSpec,
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

// 공식 기준 상수 export
export { OFFICIAL_STANDARDS };

// 개별 스펙 export (하위 호환성)
export { jobkoreaSpec, saraminSpec, driversLicenseSpec, idCardSpec };
