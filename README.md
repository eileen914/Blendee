# Blendee

여러 사용자가 함께 하나의 이미지를 16x16 픽셀로 나누어 완성하는 협업 사진 모자이크 웹 애플리케이션입니다.

## 🌟 주요 기능

### ① AI 기반 색상 추출 및 랜덤 할당

- 이미지를 16x16 그리드(256개 픽셀)로 자동 분할
- Canvas API를 사용한 실제 색상 분석
- 참여자에게 랜덤한 컬러 블록(3~5개) 자동 배정

### ② 스마트 색상 매칭 검증

- 업로드한 사진의 주요 색상을 자동 추출
- 배정된 색상과의 일치도 실시간 검증 (±10% 허용 오차)
- 검증 실패 시 재업로드 안내

### ③ 컬러코드 클릭 한 번으로 업로드

- "내 컬러 미션"에서 컬러코드를 클릭하면 즉시 업로드 모달 열림
- 같은 색상의 모든 픽셀에 자동으로 적용
- 3~5번의 업로드로 전체 작품 완성

### ④ 실시간 진행 상황 확인

- 픽셀 그리드에서 실시간으로 채워지는 모습 확인
- 전체 진행률 및 개인 완성도 표시
- 완성 시 자동으로 피드에 게시

## 🚀 시작하기

### 필수 요구사항

- Node.js v20.x 이상
- npm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173 열기
```

## 📂 프로젝트 구조

```
src/
├── App.tsx                    # 메인 라우터 설정
├── index.tsx                  # 엔트리 포인트
├── index.css                  # 글로벌 스타일
├── components/
│   ├── ColorAssignment.tsx   # 색상 배정 컴포넌트 (클릭 가능)
│   ├── PhotoUpload.tsx       # 사진 업로드 모달 (색상 검증)
│   ├── PixelGrid.tsx         # 픽셀 그리드 표시
│   └── RoomCard.tsx          # 방 카드 컴포넌트
├── contexts/
│   └── RoomContext.tsx       # 전역 방 상태 관리
├── pages/
│   ├── Home.tsx              # 홈 (방 목록)
│   ├── CreateRoom.tsx        # 방 생성 페이지
│   ├── RoomDetail.tsx        # 방 상세 페이지
│   └── Feed.tsx              # 완성된 작품 피드
├── types/
│   └── index.ts              # TypeScript 타입 정의
└── utils/
    ├── colorExtractor.ts     # 색상 추출 및 검증 로직
    └── mockData.ts           # 목업 데이터
```

## 🎯 사용 방법

### 1. 방 생성

1. 홈에서 **"새 방 만들기"** 클릭
2. 방 제목 입력
3. 목표 이미지 업로드
4. 공개/비공개 설정 선택
5. 완성 기한 설정
6. "방 만들기" 클릭
7. 이미지가 256개 픽셀로 자동 분할됨

### 2. 사진 업로드

**방법 1: 컬러코드 클릭 (권장)**

1. RoomDetail 페이지에서 "내 컬러 미션" 확인
2. 업로드하고 싶은 컬러코드 클릭
3. 업로드 모달 열림
4. 해당 색상이 포함된 사진 선택
5. 자동 색상 검증
6. 승인 시 같은 색상의 모든 픽셀에 자동 적용

**방법 2: 픽셀 그리드 클릭**

1. 파란 테두리 픽셀 클릭
2. 업로드 모달 열림
3. 사진 선택 및 업로드

### 3. 완성 및 공유

1. 모든 컬러코드 업로드 완료
2. "내 컬러 미션"에 모든 컬러가 초록색으로 표시
3. 전체 진행률 100% 도달
4. "피드에 게시하기" 버튼 활성화
5. 클릭하여 피드에 공유

## 🛠 기술 스택

### 프론트엔드

- **React 18.3** - UI 프레임워크
- **TypeScript 5.5** - 타입 안전성
- **Vite 5.2** - 빌드 도구
- **React Router 6.26** - 라우팅
- **Tailwind CSS 3.4** - 스타일링
- **Lucide React** - 아이콘

### 주요 기술

- **Canvas API** - 이미지 색상 분석
- **React Context** - 전역 상태 관리
- **FileReader API** - 이미지 파일 처리

## 🎨 핵심 로직

### 색상 추출 알고리즘

```typescript
// 1. Canvas에 이미지 로드
// 2. 16x16 그리드로 분할
// 3. 각 셀의 ImageData 추출
// 4. RGB 평균값 계산
// 5. Hex 코드로 변환
```

### 색상 매칭 검증

```typescript
// 1. RGB 차이의 절대값 계산: |R1-R2| + |G1-G2| + |B1-B2|
// 2. 평균 차이: (위 합) / 3
// 3. 톨러런스와 비교: diff <= 25 (±10%)
// 4. true/false 반환
```

### 동일 컬러 픽셀 자동 채우기

```typescript
// 업로드 성공 시
room.pixels.forEach((pixel) => {
  if (pixel.colorCode === uploadedColor && !pixel.uploadedPhoto) {
    pixel.uploadedPhoto = uploadedImage;
  }
});
```

## 📊 데이터 흐름

```
CreateRoom (방 생성)
    ↓
RoomContext.createRoom()
    ↓
extractColorsFromImage() - 이미지 분석
    ↓
Room 객체 생성 (256개 픽셀)
    ↓
Context에 저장
    ↓
RoomDetail 페이지로 이동
    ↓
사용자가 컬러코드 클릭
    ↓
사진 업로드 → 색상 검증
    ↓
같은 컬러의 모든 픽셀 자동 채우기
    ↓
Context 업데이트
    ↓
홈에서 완성된 작품 확인
```

## 🔮 향후 계획

### Phase 2: 백엔드 연동

- [ ] Node.js + Express 서버 구축
- [ ] PostgreSQL/MongoDB 데이터베이스
- [ ] 이미지 업로드 API (AWS S3 / Cloudinary)
- [ ] 실시간 동기화 (Socket.io)

### Phase 3: 인증 시스템

- [ ] JWT 기반 인증
- [ ] 사용자 프로필 관리
- [ ] 개인 "참여 컬러 캔버스" 저장

### Phase 4: 고급 기능

- [ ] CIELAB 색상 공간으로 더 정확한 매칭
- [ ] 머신러닝 기반 색상 분석
- [ ] 소셜 기능 (좋아요, 댓글, 공유)
