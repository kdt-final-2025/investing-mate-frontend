# Red Light Frontend

AI 기반의 투자 정보 플랫폼 Red Light의 프론트엔드 프로젝트입니다.

## 기술 스택

### 핵심 프레임워크 & 라이브러리
- [Next.js](https://nextjs.org/) - React 기반의 풀스택 웹 프레임워크
- [React](https://reactjs.org/) - 사용자 인터페이스 구축을 위한 JavaScript 라이브러리
- [TypeScript](https://www.typescriptlang.org/) - 정적 타입 지원을 위한 JavaScript 슈퍼셋

### UI & 스타일링
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크
- [Radix UI](https://www.radix-ui.com/) - 접근성 높은 UI 컴포넌트 라이브러리
- [Framer Motion](https://www.framer.com/motion/) - 애니메이션 라이브러리
- [@splinetool/react-spline](https://spline.design/) - 3D 모델 렌더링을 위한 라이브러리
- [Recharts](https://recharts.org/) - 반응형 차트 및 데이터 시각화 라이브러리
  - 스파크라인 차트
  - 실시간 데이터 시각화
  - SVG 기반 렌더링

### 데이터 관리 & API
- [SWR](https://swr.vercel.app/) - React Hooks 기반의 데이터 페칭 라이브러리
  - 실시간 데이터 자동 갱신
  - 캐시 및 재검증 전략
  - 에러 처리 및 재시도 로직
- [Axios](https://axios-http.com/) - HTTP 클라이언트 라이브러리
  - Promise 기반 HTTP 요청
  - 요청/응답 인터셉터
  - 자동 JSON 변환

### 실시간 시장 데이터
- Yahoo Finance API 연동
  - 실시간 주가 정보
  - 전일 대비 등락률
  - 주요 지표 데이터
- 지원 지표:
  - KOSPI
  - KOSDAQ
  - USD/KRW
  - BTC/KRW

### 개발 도구
- [ESLint](https://eslint.org/) - 코드 품질 및 스타일 검사 도구
- [PostCSS](https://postcss.org/) - CSS 처리 도구
- [Autoprefixer](https://autoprefixer.github.io/) - CSS 벤더 프리픽스 자동화

## 주요 기능

### 실시간 시장 데이터 표시
- 10초 간격 자동 갱신
- 등락률 색상 구분 (상승: 녹색, 하락: 빨간색)
- 반응형 레이아웃
- 로딩 상태 애니메이션
- 에러 처리 및 재시도

### 3D 모델 렌더링
- Spline 기반 3D 모델 표시
- 동적 로딩 처리
- 성능 최적화

### 사용자 인터페이스
- 다크 테마 기반 디자인
- 반응형 레이아웃
- 모던한 UI/UX
- 접근성 고려

## 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 패키지 매니저

### 환경 설정
1. 환경 변수 설정
```env
# Yahoo Finance API 설정
API_KEY=your_api_key_here
```

### 설치 및 실행

1. 프로젝트 클론
```bash
git clone [repository-url]
cd frontend
```

2. 기본 의존성 설치
```bash
npm install
# or
yarn install
```

3. 필수 패키지 설치

```bash
# 1. UI & 스타일링
npm install tailwindcss@^3.0.0 postcss@^8.0.0 autoprefixer@^10.0.0    # Tailwind CSS 설정
npm install @radix-ui/react-slot@^1.0.0                                # Radix UI
npm install framer-motion@^11.0.0                                      # 애니메이션
npm install @splinetool/react-spline@2.2.6 @splinetool/runtime@0.9.518 # 3D 렌더링 (버전 주의)
npm install recharts@^2.12.0                                          # 차트 & 데이터 시각화

# 2. 데이터 관리 & API
npm install swr axios

# 3. 개발 도구
npm install -D @types/node @types/react @types/react-dom               # TypeScript 타입 정의
npm install -D eslint@^8.0.0 eslint-config-next@^14.0.0               # 코드 품질 관리
```

4. 개발 서버 실행
```bash
npm run dev
# or
yarn dev
```

5. 브라우저에서 확인
```
http://localhost:3000
```

### 패키지 설치 주의사항

1. **버전 호환성**
   - Next.js와 React 버전이 맞지 않으면 충돌이 발생할 수 있습니다
   - 위 명시된 버전을 정확히 따라주세요
   - @splinetool/react-spline은 Next.js와 호환성 문제가 있을 수 있으므로 최신 버전 사용을 권장합니다
   - 빌드 에러 발생 시 @splinetool/runtime도 함께 설치해주세요

2. **설치 순서**
   - Tailwind CSS 관련 패키지는 반드시 먼저 설치하고 설정해야 합니다
   - 이후 다른 UI 패키지들을 설치해주세요

3. **빌드 에러 대응**
   - 패키지 설치 후 빌드 에러 발생 시:
     ```bash
     npm cache clean --force  # 캐시 초기화
     rm -rf node_modules      # node_modules 삭제
     npm install             # 의존성 재설치
     ```

4. **선택적 패키지**
   - 프로젝트 역할에 따라 필요한 패키지만 선택적으로 설치 가능
   - 예: 3D 기능이 필요없는 경우 @splinetool/react-spline 제외 가능

## 프로젝트 구조

```
frontend/
├── src/
│   ├── app/          # 페이지 및 레이아웃
│   │   ├── api/      # API 라우트
│   │   └── main/     # 메인 페이지
│   ├── components/   # 재사용 가능한 컴포넌트
│   │   └── ui/       # UI 컴포넌트
│   ├── hooks/        # 커스텀 훅
│   └── styles/       # 전역 스타일
├── public/           # 정적 파일
└── package.json      # 프로젝트 의존성 및 스크립트
```

## 로깅 및 디버깅

### 서버 사이드 로깅
- API 응답 데이터 구조 검증
- 실시간 시장 데이터 처리 과정
- 에러 상황 상세 정보

### 클라이언트 사이드 로깅
- 데이터 페칭 상태
- 컴포넌트 렌더링 사이클
- 사용자 인터랙션

## 라이선스

[라이선스 정보 추가 필요]

## 의존성 버전 정보

### 프레임워크 & 코어
- next: ^14.2.28
- react: ^18.0.0
- react-dom: ^18.0.0
- typescript: ^5.0.0

### UI & 스타일링
- tailwindcss: ^3.0.0
- @radix-ui/react-slot: ^1.0.0
- framer-motion: ^11.0.0
- @splinetool/react-spline: ^2.2.6
- recharts: ^2.12.0

### 개발 도구
- postcss: ^8.0.0
- autoprefixer: ^10.0.0
- eslint: ^8.0.0
- eslint-config-next: ^14.0.0

### 알려진 이슈

1. **@splinetool/react-spline 빌드 에러**
   - 증상: `Package path . is not exported from package` 에러
   - 해결방법:
     ```bash
     # 기존 패키지 제거
     npm uninstall @splinetool/react-spline @splinetool/runtime
     
     # 안정적인 버전 설치
     npm install @splinetool/react-spline@2.2.6 @splinetool/runtime@0.9.518
     ```
   - Next.js에서는 반드시 아래와 같이 dynamic import를 사용해야 합니다:
     ```typescript
     // 올바른 사용 방법
     import dynamic from 'next/dynamic';
     
     const Spline = dynamic(
       () => import('@splinetool/react-spline').then((mod) => mod.default),
       {
         ssr: false,
         loading: () => <LoadingComponent />
       }
     );
     
     // 잘못된 사용 방법 (빌드 에러 발생)
     import Spline from '@splinetool/react-spline';
     ```
   - SSR(Server-Side Rendering)을 비활성화해야 합니다
   - 로딩 상태 처리를 추가하는 것을 권장합니다
   - 특정 버전(2.2.6/0.9.518)을 사용해야 Next.js와 호환성 문제가 없습니다
