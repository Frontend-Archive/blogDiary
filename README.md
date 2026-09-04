# blogDiary

여러 블로그에 흩어진 글을 **날짜별로 모아 다이어리처럼** 넘겨보는 아카이브.
글을 쓰는 서비스가 아니라, 이미 발행된 글을 모아서 보여주는 사이트입니다.

## 화면 구성

- **표지** — 사이트 소개와 수집 현황(지면 수, 글 수, 기간)
- **책갈피** — 목차 역할. 월 → 날짜 순으로 나열되고, 누르면 해당 날짜 지면으로 바로 이동합니다.
  스크롤에 따라 현재 보고 있는 날짜가 표시됩니다(스크롤 스파이).
  데스크톱에서는 왼쪽 세로 목차, 모바일에서는 가로로 넘기는 띠로 바뀝니다.
- **지면** — 하루치 글 모음. 날짜 헤더 아래에 시간 순으로 글이 놓입니다.
  글 제목을 누르면 원문 블로그로 이동합니다.

## 디자인 컨셉

'은은한 종이' 느낌의 다이어리. 과한 스큐어모피즘 없이 다음 요소로만 표현합니다.

- 크림빛 지면(`--paper`)과 잉크색 본문(`--ink`)
- 아주 옅은 괘선(`.ruled`)과 종이 얼룩(`.paper-grain`)
- 날짜 숫자에만 쓰는 명조 계열(`--font-serif`)
- 책갈피 리본 색(`--ribbon`)을 유일한 강조색으로 사용

색은 모두 CSS 변수로 정의하고 `@theme inline`을 통해 `bg-paper`, `text-ink-muted`,
`border-rule` 같은 Tailwind 유틸리티로 씁니다. 다크모드는 `next-themes`의 class 전략을
쓰며, `globals.css` 상단의 `@custom-variant dark`가 `.dark`와 `dark:`를 연결합니다.

## 스택

- Next.js 16 (App Router, Turbopack) / React 19 / TypeScript
- Tailwind CSS v4
- next-themes
- ESLint + Prettier

## 시작하기

```bash
yarn install
yarn dev
```

## 스크립트

| 명령어 | 설명 |
| --- | --- |
| `yarn dev` | 개발 서버 |
| `yarn build` | 프로덕션 빌드 |
| `yarn start` | 빌드 결과 실행 |
| `yarn lint` / `yarn lint:fix` | ESLint |
| `yarn format` / `yarn format:check` | Prettier |
| `yarn typecheck` | 타입 검사 |

## 구조

```
src/
├─ app/
│  ├─ layout.tsx          # 헤더/푸터, 테마 프로바이더
│  ├─ page.tsx            # 표지 + 책갈피 + 지면 목록
│  └─ globals.css         # 종이 팔레트, 괘선, 다크모드
├─ components/
│  ├─ bookmark-rail.tsx   # 책갈피 목차 (스크롤 스파이)
│  ├─ diary-day.tsx       # 하루치 지면
│  ├─ post-entry.tsx      # 글 한 줄
│  ├─ site-header.tsx / site-footer.tsx
│  └─ theme-provider.tsx / theme-toggle.tsx
├─ data/entries.ts        # 목업 데이터 (실제 수집 결과로 교체 예정)
├─ lib/
│  ├─ date.ts             # 날짜·시간 포맷 (KST 고정)
│  ├─ entries.ts          # 정렬, 월별 그룹핑
│  └─ site.ts             # 사이트 메타
└─ types/diary.ts         # Post, DiaryEntry
```

## 데이터

지금은 `src/data/entries.ts`의 목업을 씁니다. 실제 수집기를 붙일 때는
`getEntries()`가 같은 `DiaryEntry[]` 형태를 돌려주도록만 바꾸면 화면은 그대로 동작합니다.

시간 표기는 서버와 브라우저의 타임존이 달라도 같은 값이 나오도록 `Asia/Seoul`로 고정되어
있습니다(`src/lib/date.ts`).

## 폰트

빌드가 외부 네트워크에 의존하지 않도록 `next/font/google` 대신 시스템 폰트 스택을 씁니다.
Pretendard가 설치되어 있으면 우선 적용되고, 명조는 `Nanum Myeongjo` → `AppleMyungjo` →
`Batang` 순으로 대체됩니다. 웹폰트가 필요하면 `next/font/local`로 self-host 하거나
`next/font/google`을 불러와 `--font-sans` / `--font-serif`에 연결하면 됩니다.
