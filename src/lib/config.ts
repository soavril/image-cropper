// 사이트 설정
export const siteConfig = {
  name: '사진규격 맞춤',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xn--ct1b9mv0ggxlw2fmva60t.com',
  description: '증명사진 업로드 안됨? 잡코리아, 사람인, 운전면허증 사진 규격에 맞게 자동 변환. 무료, 설치 없음, 3초 완료.',
  author: '사진규격 맞춤',
  email: 'soavril@naver.com',
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
