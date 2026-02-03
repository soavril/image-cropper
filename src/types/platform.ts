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
  // 규격 출처 및 신뢰도 정보
  source: {
    name: string;        // 출처명
    url?: string;        // 공식 가이드 URL (있는 경우)
    lastVerified: string; // 마지막 확인일
    isEstimate: boolean;  // 추정치 여부
  };
}

export type PlatformId = 'jobkorea' | 'saramin' | 'drivers-license' | 'id-card';
