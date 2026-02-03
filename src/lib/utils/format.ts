/**
 * 바이트를 읽기 쉬운 형식으로 변환
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}

/**
 * KB를 바이트로 변환
 */
export function kbToBytes(kb: number): number {
  return kb * 1024;
}

/**
 * 바이트를 KB로 변환
 */
export function bytesToKb(bytes: number): number {
  return Math.round(bytes / 1024);
}

/**
 * 비율 문자열을 숫자로 변환 (예: "4:5" -> 0.8)
 */
export function parseRatio(ratio: string): number {
  const [w, h] = ratio.split(':').map(Number);
  return w / h;
}

/**
 * 두 숫자의 비율을 문자열로 변환
 */
export function calculateRatioString(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * 퍼센트 포맷
 */
export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 치수 포맷
 */
export function formatDimensions(width: number, height: number): string {
  return `${width}×${height}px`;
}
