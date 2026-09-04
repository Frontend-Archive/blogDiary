# blogDiary

개발 기록과 일상을 남기는 블로그. Next.js App Router 기반.

## 스택

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4
- next-themes (다크모드)
- ESLint + Prettier

## 시작하기

```bash
yarn install
yarn dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 스크립트

| 명령어              | 설명             |
| ------------------- | ---------------- |
| `yarn dev`          | 개발 서버 실행   |
| `yarn build`        | 프로덕션 빌드    |
| `yarn start`        | 빌드 결과 실행   |
| `yarn lint`         | ESLint 검사      |
| `yarn lint:fix`     | ESLint 자동 수정 |
| `yarn format`       | Prettier 포맷팅  |
| `yarn format:check` | 포맷 검사        |
| `yarn typecheck`    | 타입 검사        |

## 구조

```
src/
├─ app/            # 라우트 (App Router)
│  ├─ layout.tsx   # 루트 레이아웃 + 테마 프로바이더
│  ├─ page.tsx     # 홈
│  └─ globals.css  # Tailwind & 테마 토큰
├─ components/     # 공용 컴포넌트
└─ lib/            # 설정·유틸 (site.ts 등)
```

## 테마

`next-themes`의 `class` 전략을 사용합니다. Tailwind v4에서는 `globals.css` 상단의
`@custom-variant dark`가 `.dark` 클래스와 `dark:` 변형을 연결합니다.
색상은 CSS 변수(`--background`, `--foreground`, `--muted`, `--border`, `--accent`)로
정의되어 있고 `@theme inline`을 통해 `bg-background`, `text-muted` 같은 유틸리티로 쓸 수 있습니다.

## 폰트

빌드가 외부 네트워크에 의존하지 않도록 `next/font/google` 대신 시스템 폰트 스택을
사용합니다(`globals.css`의 `--font-sans`). Pretendard가 설치되어 있으면 우선 적용되고,
없으면 macOS/Windows의 기본 한글 폰트로 대체됩니다.
웹폰트를 쓰고 싶다면 `next/font/local`로 폰트 파일을 self-host 하거나
`next/font/google`을 layout에서 불러와 `--font-sans`에 연결하면 됩니다.
