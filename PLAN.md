# 제출사진 해결사 - Phase 1 + 1.5 구현 계획서

> **핵심 약속**: "사진 업로드 안됨? 3초 해결"
> **포지셔닝**: 사진 편집기가 아닌 "업로드 실패 방지 도구"

---

## 1. Phase 1 MVP Scope

### ✅ 포함 (Must Have)
- [ ] 플랫폼 선택 (4개: 운전면허증, 주민등록증, 잡코리아, 사람인)
- [ ] 이미지 업로드 (드래그 앤 드롭 + 파일 선택)
- [ ] 자동 분석 (포맷, 크기, 비율, 용량)
- [ ] 자동 조정 (크롭 + 리사이즈 + 압축)
- [ ] 결과 미리보기 + PASS/FAIL 체크리스트
- [ ] 다운로드
- [ ] EXIF 회전 자동 보정
- [ ] 개인정보 보호 배지 (서버 전송 없음)
- [ ] 면책 조항

### ✅ Phase 1.5 (Safety Net)
- [ ] "위치 조정하기" 버튼 → 수동 프레임 모드
- [ ] 고정 프레임 + 이미지 드래그
- [ ] 모바일 핀치 줌 지원
- [ ] 슬라이더 보조 (확대/축소)

### ❌ 제외 (Non-Goals)
- 얼굴 인식 / AI 크롭
- 배경 제거
- 사진 촬영 기능
- 회원가입 / 로그인
- 서버 저장
- 결제 기능

---

## 2. 퍼널 로직 (Funnel Decision Table)

```
┌─────────────────────────────────────────────────────────────────┐
│                        사용자 진입                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: 플랫폼 선택                                              │
│ "어디에 제출하시나요?" → 4개 카드                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: 이미지 업로드                                            │
│ 드래그 앤 드롭 / 파일 선택 / 카메라 (모바일)                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: 자동 분석 (< 1초)                                        │
│ - 포맷 확인 (JPG/PNG/HEIC/WEBP)                                  │
│ - 크기 확인 (width × height)                                     │
│ - 비율 계산                                                      │
│ - 용량 확인 (KB)                                                 │
│ - EXIF 회전 정보 추출                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: 자동 조정 시도                                           │
│ a) 비율 불일치 → 중앙 기준 크롭                                    │
│ b) 크기 조정 → 목표 픽셀에 맞춤                                    │
│ c) 용량 초과 → 압축 (품질 조절)                                    │
│ d) 포맷 변환 → JPG로 통일                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: 결과 미리보기                                            │
│                                                                  │
│ ┌──────────────────────────────────────┐                        │
│ │  [Before]        [After]             │                        │
│ │  2.5MB           89KB ✓              │                        │
│ │  4032×3024       413×531             │                        │
│ └──────────────────────────────────────┘                        │
│                                                                  │
│ 체크리스트:                                                       │
│ ✅ 비율 OK (35:45)                                               │
│ ✅ 크기 OK (413×531px)                                           │
│ ✅ 용량 OK (89KB)                                                │
│ ✅ 포맷 OK (JPG)                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │   사용자 선택    │
                    └─────────────────┘
                     ↙              ↘
        ┌────────────────┐    ┌────────────────────────┐
        │ "다운로드"      │    │ "위치 조정하기"         │
        │ (90% 예상)     │    │ (10% 예상)             │
        └────────────────┘    └────────────────────────┘
                ↓                        ↓
        ┌────────────────┐    ┌────────────────────────┐
        │ Step 6a:       │    │ Step 6b:               │
        │ 파일 다운로드   │    │ Manual Frame Mode      │
        │                │    │ (Phase 1.5)            │
        └────────────────┘    └────────────────────────┘
                                         ↓
                              ┌────────────────────────┐
                              │ 고정 프레임 + 드래그    │
                              │ + 핀치 줌 + 슬라이더   │
                              └────────────────────────┘
                                         ↓
                              ┌────────────────────────┐
                              │ "이 위치로 저장"        │
                              └────────────────────────┘
                                         ↓
                              ┌────────────────────────┐
                              │ 재압축 후 다운로드      │
                              └────────────────────────┘
```

### 퍼널 결정 테이블

| 조건 | 다음 단계 |
|------|----------|
| 자동 조정 성공 + 사용자 만족 | → 다운로드 |
| 자동 조정 성공 + "위치 조정" 클릭 | → Manual Frame Mode |
| HEIC/WEBP 변환 실패 | → 안내 메시지 + 변환 가이드 |
| 이미지가 너무 작음 (< 200px) | → 오류 메시지 |
| 이미지가 너무 큼 (> 50MB) | → 오류 메시지 |

---

## 3. 사이트맵 / 라우트

```
/                           # 홈 (플랫폼 선택)
/fix/drivers-license        # 운전면허증
/fix/id-card               # 주민등록증
/fix/jobkorea              # 잡코리아
/fix/saramin               # 사람인
/guide/drivers-license     # 운전면허증 가이드 (SEO)
/guide/id-card             # 주민등록증 가이드 (SEO)
/guide/jobkorea            # 잡코리아 가이드 (SEO)
/guide/saramin             # 사람인 가이드 (SEO)
/about                     # 서비스 소개
/privacy                   # 개인정보처리방침
/sitemap.xml               # 사이트맵
/robots.txt                # 로봇 설정
```

---

## 4. 컴포넌트 목록

### Core Components
```
src/components/
├── fixer/
│   ├── PlatformSelector.tsx    # 플랫폼 선택 카드
│   ├── ImageUploader.tsx       # 이미지 업로드 (기존)
│   ├── AutoAnalyzer.tsx        # 자동 분석 결과 표시
│   ├── ResultPreview.tsx       # Before/After 미리보기 (기존)
│   ├── PassFailChecklist.tsx   # PASS/FAIL 체크리스트 (신규)
│   ├── ManualFrameEditor.tsx   # 수동 프레임 모드 (Phase 1.5)
│   ├── DownloadButton.tsx      # 다운로드 (기존)
│   ├── TrustBlock.tsx          # 신뢰 배지 (기존)
│   └── FeedbackPrompt.tsx      # 피드백 수집 (신규)
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── ProgressBar.tsx
│   ├── Slider.tsx              # 줌 슬라이더 (신규)
│   └── Badge.tsx
└── layout/
    ├── Header.tsx
    └── Footer.tsx
```

### ManualFrameEditor 상세 구조
```tsx
ManualFrameEditor/
├── FrameOverlay.tsx      # 고정 프레임 (어두운 마스크)
├── DraggableImage.tsx    # 드래그 가능한 이미지
├── ZoomSlider.tsx        # 확대/축소 슬라이더
├── GuideText.tsx         # 안내 문구
└── ActionButtons.tsx     # 저장/취소 버튼
```

---

## 5. 플랫폼 설정 스키마

```typescript
// src/lib/platforms/config.ts

export interface PlatformConfig {
  id: string;
  name: string;
  displayName: string;

  // 물리적 규격 (확실한 정보)
  physicalSize: {
    width: number;    // cm
    height: number;   // cm
  };

  // 픽셀 규격 (300dpi 기준 계산 또는 권장)
  pixelSize: {
    width: number;
    height: number;
    isRecommended: boolean;  // true = "권장", false = "공식"
  };

  // 용량 제한
  maxSizeKB: number | null;  // null = 알 수 없음
  isMaxSizeRecommended: boolean;

  // 비율
  aspectRatio: string;  // "35:45", "3:4" 등

  // 포맷
  formats: string[];
  recommendedFormat: string;

  // 주의사항
  notes: string[];

  // 출처 정보
  source: {
    name: string;
    url: string | null;
    isOfficial: boolean;
  };
}

export const platforms: Record<string, PlatformConfig> = {
  'drivers-license': {
    id: 'drivers-license',
    name: 'drivers-license',
    displayName: '운전면허증',
    physicalSize: { width: 3.5, height: 4.5 },
    pixelSize: {
      width: 413,   // 3.5cm × 118.11 (300dpi)
      height: 531,  // 4.5cm × 118.11 (300dpi)
      isRecommended: false  // 공식 규격
    },
    maxSizeKB: null,
    isMaxSizeRecommended: true,
    aspectRatio: '35:45',
    formats: ['jpg'],
    recommendedFormat: 'jpg',
    notes: [
      '여권사진 규격과 동일 (3.5cm × 4.5cm)',
      '6개월 이내 촬영한 천연색 사진',
      '정면 응시, 무표정 또는 자연스러운 표정',
      '흰색 또는 밝은 단색 배경',
      '모자, 선글라스 착용 불가',
    ],
    source: {
      name: '경찰청 운전면허시험관리단',
      url: 'https://www.safedriving.or.kr',
      isOfficial: true,
    },
  },

  'id-card': {
    id: 'id-card',
    name: 'id-card',
    displayName: '주민등록증',
    physicalSize: { width: 3.5, height: 4.5 },
    pixelSize: {
      width: 413,
      height: 531,
      isRecommended: false
    },
    maxSizeKB: null,
    isMaxSizeRecommended: true,
    aspectRatio: '35:45',
    formats: ['jpg'],
    recommendedFormat: 'jpg',
    notes: [
      '여권사진 규격과 동일 (3.5cm × 4.5cm)',
      '6개월 이내 촬영한 천연색 사진',
      '정면 응시, 자연스러운 표정',
      '흰색 배경',
      '모자, 선글라스, 안대 착용 불가',
    ],
    source: {
      name: '정부24',
      url: 'https://www.gov.kr',
      isOfficial: true,
    },
  },

  'jobkorea': {
    id: 'jobkorea',
    name: 'jobkorea',
    displayName: '잡코리아',
    physicalSize: { width: 3, height: 4 },
    pixelSize: {
      width: 354,   // 3cm × 118.11 (300dpi)
      height: 472,  // 4cm × 118.11 (300dpi)
      isRecommended: true  // 권장 (공식 미확인)
    },
    maxSizeKB: 500,
    isMaxSizeRecommended: true,  // 권장
    aspectRatio: '3:4',
    formats: ['jpg', 'png'],
    recommendedFormat: 'jpg',
    notes: [
      '범용 이력서 사진 규격 (3cm × 4cm) 기준',
      '플랫폼별 픽셀/용량 제한은 다를 수 있음',
      '증명사진 형태 권장',
      '단정한 복장, 밝은 배경',
    ],
    source: {
      name: '일반 이력서 사진 규격 (플랫폼 공식 미확인)',
      url: null,
      isOfficial: false,
    },
  },

  'saramin': {
    id: 'saramin',
    name: 'saramin',
    displayName: '사람인',
    physicalSize: { width: 3, height: 4 },
    pixelSize: {
      width: 354,
      height: 472,
      isRecommended: true
    },
    maxSizeKB: 500,
    isMaxSizeRecommended: true,
    aspectRatio: '3:4',
    formats: ['jpg', 'png'],
    recommendedFormat: 'jpg',
    notes: [
      '범용 이력서 사진 규격 (3cm × 4cm) 기준',
      '플랫폼별 픽셀/용량 제한은 다를 수 있음',
      '증명사진 형태 권장',
      '단정한 복장, 밝은 배경',
    ],
    source: {
      name: '일반 이력서 사진 규격 (플랫폼 공식 미확인)',
      url: null,
      isOfficial: false,
    },
  },
};
```

---

## 6. Manual Frame Editor 구현 상세

### 6.1 핵심 원칙
```
┌─────────────────────────────────────┐
│         어두운 마스크 영역            │
│    ┌───────────────────────┐        │
│    │                       │        │
│    │    고정 프레임         │        │
│    │    (밝은 영역)         │        │
│    │    = 최종 출력 영역     │        │
│    │                       │        │
│    └───────────────────────┘        │
│                                     │
│  [이미지는 프레임 뒤에서 드래그]      │
└─────────────────────────────────────┘

규칙:
1. 프레임 크기 = 목표 비율 (고정)
2. 이미지는 프레임보다 항상 크거나 같아야 함
3. 이미지가 프레임 밖으로 빈 공간 노출 금지
4. 핀치 줌: 최소 = 프레임 꽉 채움, 최대 = 원본 크기
```

### 6.2 좌표 계산

```typescript
interface FrameState {
  // 이미지 상태
  imageScale: number;      // 1.0 = 원본 크기
  imageOffsetX: number;    // 프레임 기준 X 오프셋
  imageOffsetY: number;    // 프레임 기준 Y 오프셋

  // 프레임 상태 (고정)
  frameWidth: number;      // 화면에 표시되는 프레임 너비
  frameHeight: number;     // 화면에 표시되는 프레임 높이

  // 원본 이미지
  originalWidth: number;
  originalHeight: number;
}

// 경계 제한 계산
function clampPosition(state: FrameState): { x: number, y: number } {
  const scaledWidth = state.originalWidth * state.imageScale;
  const scaledHeight = state.originalHeight * state.imageScale;

  // 최소/최대 오프셋 계산 (이미지가 프레임을 벗어나지 않도록)
  const minX = state.frameWidth - scaledWidth;
  const maxX = 0;
  const minY = state.frameHeight - scaledHeight;
  const maxY = 0;

  return {
    x: Math.min(maxX, Math.max(minX, state.imageOffsetX)),
    y: Math.min(maxY, Math.max(minY, state.imageOffsetY)),
  };
}

// 최종 크롭 영역 계산 (원본 이미지 기준)
function calculateCropArea(state: FrameState): CropArea {
  const scaledWidth = state.originalWidth * state.imageScale;
  const scaledHeight = state.originalHeight * state.imageScale;

  // 프레임 영역이 원본 이미지에서 어디에 해당하는지 계산
  const cropX = -state.imageOffsetX / state.imageScale;
  const cropY = -state.imageOffsetY / state.imageScale;
  const cropWidth = state.frameWidth / state.imageScale;
  const cropHeight = state.frameHeight / state.imageScale;

  return { cropX, cropY, cropWidth, cropHeight };
}
```

### 6.3 터치 이벤트 처리

```typescript
// 드래그
onTouchMove(e: TouchEvent) {
  if (e.touches.length === 1) {
    // 단일 터치 = 드래그
    const deltaX = e.touches[0].clientX - lastTouchX;
    const deltaY = e.touches[0].clientY - lastTouchY;

    setImageOffset(prev => clampPosition({
      ...state,
      imageOffsetX: prev.x + deltaX,
      imageOffsetY: prev.y + deltaY,
    }));
  }
}

// 핀치 줌
onTouchMove(e: TouchEvent) {
  if (e.touches.length === 2) {
    const distance = getDistance(e.touches[0], e.touches[1]);
    const scale = distance / initialPinchDistance;

    // 최소 스케일: 프레임을 꽉 채우는 크기
    const minScale = Math.max(
      frameWidth / originalWidth,
      frameHeight / originalHeight
    );

    // 최대 스케일: 원본 크기
    const maxScale = 1.0;

    const newScale = Math.min(maxScale, Math.max(minScale, baseScale * scale));
    setImageScale(newScale);
  }
}
```

---

## 7. 이미지 처리 파이프라인

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Upload    │ →  │   Decode    │ →  │   EXIF      │ →  │   Analyze   │
│   (File)    │    │   (Image)   │    │   Fix       │    │   (Check)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                ↓
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Export    │ ←  │   Compress  │ ←  │   Resize    │ ←  │   Crop      │
│   (Blob)    │    │   (Quality) │    │   (Scale)   │    │   (Ratio)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 알고리즘 요약

| 단계 | 입력 | 처리 | 출력 |
|------|------|------|------|
| Decode | File | `new Image()` + `canvas.drawImage()` | Canvas |
| EXIF Fix | Canvas | EXIF orientation 읽고 회전 적용 | Canvas |
| Analyze | Canvas | 크기, 비율, 용량 계산 | AnalysisResult |
| Crop | Canvas + CropArea | 비율에 맞게 중앙 크롭 (또는 수동 영역) | Canvas |
| Resize | Canvas | 목표 픽셀 크기로 축소 (다단계) | Canvas |
| Compress | Canvas | Binary search로 목표 용량 달성 | Blob |
| Export | Blob | `canvas.toBlob()` | File |

---

## 8. 성능 및 메모리 전략

### 메모리 관리
```typescript
// Blob URL 관리
const blobUrls = new Set<string>();

function createBlobUrl(blob: Blob): string {
  const url = URL.createObjectURL(blob);
  blobUrls.add(url);
  return url;
}

function cleanup() {
  blobUrls.forEach(url => URL.revokeObjectURL(url));
  blobUrls.clear();
}

// 페이지 이탈 시 정리
window.addEventListener('beforeunload', cleanup);
```

### 대용량 이미지 처리
```typescript
// 10MB 이상 이미지는 먼저 다운스케일
const MAX_PROCESSING_SIZE = 4096;

function preprocessLargeImage(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const maxDim = Math.max(canvas.width, canvas.height);

  if (maxDim > MAX_PROCESSING_SIZE) {
    const scale = MAX_PROCESSING_SIZE / maxDim;
    // 다운스케일 후 처리
  }

  return canvas;
}
```

---

## 9. Analytics 이벤트 (Privacy-Friendly)

```typescript
// 수집하는 이벤트 (개인정보 없음)
const events = {
  // 페이지
  'page_view': { platform: string },

  // 퍼널
  'upload_start': { platform: string },
  'upload_complete': { platform: string, fileType: string },
  'auto_fix_complete': { platform: string, passed: boolean },
  'manual_mode_open': { platform: string },
  'download': { platform: string },

  // 피드백
  'feedback_submit': { platform: string, success: boolean },
};

// 수집하지 않는 정보
// - 이미지 데이터
// - 파일 이름
// - IP 주소 (서버 없음)
// - 사용자 식별 정보
```

---

## 10. QA 테스트 케이스

### 기본 플로우
- [ ] 각 플랫폼 선택 후 업로드 → 자동 조정 → 다운로드
- [ ] 결과 미리보기에서 Before/After 정확히 표시
- [ ] 다운로드 파일이 올바른 크기/비율/용량

### 이미지 타입
- [ ] JPG 업로드 → 정상 처리
- [ ] PNG 업로드 → JPG로 변환
- [ ] HEIC 업로드 → 안내 메시지 또는 변환
- [ ] WEBP 업로드 → 안내 메시지 또는 변환

### 크기 케이스
- [ ] 작은 이미지 (200x200) → 경고 또는 거부
- [ ] 큰 이미지 (8000x6000) → 정상 처리
- [ ] 매우 큰 이미지 (50MB+) → 메모리 관리 확인

### 비율 케이스
- [ ] 정방형 (1:1) → 상하 크롭
- [ ] 가로형 (16:9) → 좌우 크롭
- [ ] 세로형 (9:16) → 상하 크롭
- [ ] 이미 맞는 비율 → 크롭 없이 리사이즈만

### Manual Frame Mode
- [ ] 드래그로 이미지 이동
- [ ] 핀치 줌으로 확대/축소
- [ ] 슬라이더로 확대/축소
- [ ] 이미지가 프레임 밖으로 나가지 않음
- [ ] 저장 시 정확한 영역 크롭

### 모바일
- [ ] iOS Safari 터치 이벤트
- [ ] Android Chrome 터치 이벤트
- [ ] 세로 모드 레이아웃
- [ ] 가로 모드 레이아웃

### 엣지 케이스
- [ ] EXIF 회전이 있는 사진 (orientation 1-8)
- [ ] 투명 배경 PNG → 흰색 배경으로 변환
- [ ] 매우 긴 세로 사진
- [ ] 매우 넓은 가로 사진

---

## 11. 런칭 체크리스트

### 배포 전
- [ ] 빌드 성공 확인
- [ ] 모든 페이지 접근 가능
- [ ] 모바일 반응형 확인
- [ ] 성능 테스트 (Lighthouse)

### SEO
- [ ] robots.txt 설정
- [ ] sitemap.xml 생성
- [ ] Google Search Console 등록
- [ ] Naver Search Advisor 등록

### 법적
- [ ] 개인정보처리방침 페이지
- [ ] 면책 조항 모든 페이지에 표시
- [ ] "비공식 도구" 명시

### 모니터링
- [ ] Google Analytics 연동
- [ ] 에러 로깅 설정

---

## 12. 향후 개선 (2주 더 있다면)

1. **얼굴 인식 기반 자동 크롭**
   - 현재: 중앙 기준 크롭
   - 개선: 얼굴 위치 감지 후 최적 영역 크롭

2. **더 많은 플랫폼 지원**
   - 여권
   - 비자
   - 자격증 사진

3. **사용자 피드백 루프**
   - "업로드 성공했나요?" 데이터 수집
   - 플랫폼별 실제 제한값 업데이트

4. **PWA 지원**
   - 오프라인 사용
   - 홈 화면 추가

---

## 13. 가장 큰 신뢰 리스크와 대응

### 리스크: "자동 크롭이 얼굴을 잘랐어요"

### 대응:
1. **미리보기 필수**: 다운로드 전 결과 확인
2. **"위치 조정" 탈출구**: 불만족 시 수동 조정 가능
3. **명확한 안내**: "결과를 확인하세요" 문구
4. **면책 조항**: "최종 확인은 사용자 책임"

### 추가 신뢰 장치:
- "서버 전송 없음" 배지 상단 고정
- 처리 과정 투명하게 표시 (체크리스트)
- 공식/권장 구분 명확히 표시

---

## 구현 순서

### Day 1: 기반 재구성
1. 플랫폼 설정 스키마 적용
2. PassFailChecklist 컴포넌트
3. 퍼널 플로우 수정

### Day 2: Manual Frame Editor
4. ManualFrameEditor 기본 구조
5. 드래그 기능
6. 핀치 줌 기능
7. 줌 슬라이더

### Day 3: 통합 및 테스트
8. 퍼널 통합
9. 모바일 테스트
10. 엣지 케이스 처리

### Day 4: 마무리
11. UI 다듬기
12. 면책 조항 강화
13. SEO 최적화
14. 배포
