// 사이트 설정
export const siteConfig = {
  name: '제출사진 해결사',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  description: '사진 업로드 안됨? 3초만에 해결하세요. 서버 저장 없이 브라우저에서 바로 처리됩니다.',
  author: '제출사진 해결사',
  email: 'contact@example.com',
};

// 이미지 처리 설정
export const imageConfig = {
  maxUploadSizeMB: 10,
  supportedFormats: ['image/jpeg', 'image/png'] as const,
  defaultQuality: 0.92,
  minQuality: 0.1,
  maxQuality: 0.95,
  compressionIterations: 10,
};

// 분석 설정
export const analyticsConfig = {
  enabled: process.env.NODE_ENV === 'production',
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
};
