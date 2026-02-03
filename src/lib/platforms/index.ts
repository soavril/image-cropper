import type { PlatformSpec, PlatformId } from '@/types';
import { jobkoreaSpec } from './jobkorea';
import { saraminSpec } from './saramin';
import { driversLicenseSpec } from './drivers-license';
import { idCardSpec } from './id-card';

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

export { jobkoreaSpec, saraminSpec, driversLicenseSpec, idCardSpec };
