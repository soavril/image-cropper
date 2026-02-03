/**
 * 이미지 규격 분석기
 */

import type { ImageData, AnalysisResult, AnalysisIssue } from '@/types';
import type { PlatformSpec } from '@/types';
import { formatBytes, bytesToKb, parseRatio, calculateRatioString } from '@/lib/utils/format';

/**
 * 이미지를 플랫폼 규격에 맞춰 분석합니다.
 */
export function analyzeImage(
  image: ImageData,
  platform: PlatformSpec
): AnalysisResult {
  const issues: AnalysisIssue[] = [];

  // 1. 파일 크기 검사
  const sizeIssue = checkFileSize(image, platform);
  issues.push(sizeIssue);

  // 2. 이미지 너비 검사
  const widthIssue = checkWidth(image, platform);
  issues.push(widthIssue);

  // 3. 이미지 높이 검사
  const heightIssue = checkHeight(image, platform);
  issues.push(heightIssue);

  // 4. 비율 검사
  const ratioIssue = checkRatio(image, platform);
  issues.push(ratioIssue);

  // 5. 포맷 검사
  const formatIssue = checkFormat(image, platform);
  issues.push(formatIssue);

  // 전체 통과 여부
  const passed = issues.every((issue) => issue.passed);

  // 점수 계산 (통과 항목 비율)
  const passedCount = issues.filter((i) => i.passed).length;
  const score = Math.round((passedCount / issues.length) * 100);

  return {
    passed,
    issues,
    score,
  };
}

/**
 * 파일 크기 검사
 */
function checkFileSize(image: ImageData, platform: PlatformSpec): AnalysisIssue {
  const currentKB = bytesToKb(image.sizeBytes);
  const maxKB = platform.maxSizeKB;
  const passed = currentKB <= maxKB;

  return {
    type: 'size',
    label: '파일 크기',
    current: formatBytes(image.sizeBytes),
    required: `${maxKB}KB 이하`,
    passed,
  };
}

/**
 * 이미지 너비 검사
 */
function checkWidth(image: ImageData, platform: PlatformSpec): AnalysisIssue {
  const current = image.currentDimensions.width;
  const target = platform.dimensions.width;
  const tolerance = platform.dimensions.tolerance;

  // 너비는 최소 target 이상이어야 함 (리사이즈 가능)
  // 또는 tolerance 범위 내
  const passed = current >= target - tolerance;

  return {
    type: 'width',
    label: '이미지 너비',
    current: `${current}px`,
    required: `${target}px 이상`,
    passed,
  };
}

/**
 * 이미지 높이 검사
 */
function checkHeight(image: ImageData, platform: PlatformSpec): AnalysisIssue {
  const current = image.currentDimensions.height;
  const target = platform.dimensions.height;
  const tolerance = platform.dimensions.tolerance;

  // 높이는 최소 target 이상이어야 함 (리사이즈 가능)
  const passed = current >= target - tolerance;

  return {
    type: 'height',
    label: '이미지 높이',
    current: `${current}px`,
    required: `${target}px 이상`,
    passed,
  };
}

/**
 * 비율 검사
 */
function checkRatio(image: ImageData, platform: PlatformSpec): AnalysisIssue {
  const currentRatio =
    image.currentDimensions.width / image.currentDimensions.height;
  const targetRatio = parseRatio(platform.dimensions.ratio);

  // 비율 차이 허용 범위 (10%)
  const tolerance = 0.1;
  const ratioDiff = Math.abs(currentRatio - targetRatio) / targetRatio;
  const passed = ratioDiff <= tolerance;

  const currentRatioStr = calculateRatioString(
    image.currentDimensions.width,
    image.currentDimensions.height
  );

  return {
    type: 'ratio',
    label: `비율`,
    current: currentRatioStr,
    required: platform.dimensions.ratio,
    passed,
  };
}

/**
 * 포맷 검사
 */
function checkFormat(image: ImageData, platform: PlatformSpec): AnalysisIssue {
  const current = image.format;
  const allowed = platform.formats;
  const passed = allowed.includes(current);

  return {
    type: 'format',
    label: '파일 형식',
    current: current.toUpperCase(),
    required: allowed.map((f) => f.toUpperCase()).join('/'),
    passed,
  };
}

/**
 * 분석 결과에서 실패한 항목만 추출
 */
export function getFailedIssues(result: AnalysisResult): AnalysisIssue[] {
  return result.issues.filter((issue) => !issue.passed);
}

/**
 * 수정이 필요한 항목 타입 추출
 */
export function getRequiredFixes(
  result: AnalysisResult
): Array<'resize' | 'compress' | 'crop' | 'format'> {
  const fixes: Array<'resize' | 'compress' | 'crop' | 'format'> = [];

  for (const issue of result.issues) {
    if (issue.passed) continue;

    switch (issue.type) {
      case 'size':
        fixes.push('compress');
        break;
      case 'width':
      case 'height':
        fixes.push('resize');
        break;
      case 'ratio':
        fixes.push('crop');
        break;
      case 'format':
        fixes.push('format');
        break;
    }
  }

  // 중복 제거
  return [...new Set(fixes)];
}
