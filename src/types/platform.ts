/**
 * 플랫폼 규격 타입 정의
 */

export interface PlatformDimensions {
  width: number;
  height: number;
  ratio: string;
  tolerance: number; // 허용 오차 (px)
}

export interface PlatformSpec {
  id: string;
  name: string;
  displayName: string;
  maxSizeKB: number;
  dimensions: PlatformDimensions;
  formats: ('jpg' | 'png')[];
  recommendedFormat: 'jpg' | 'png';
  notes: string[];
  keywords: {
    error: string[];
    spec: string[];
  };
}

export type PlatformId = 'jobkorea' | 'saramin' | 'drivers-license' | 'id-card';
