# blogDiary

[Frontend-Archive/archive](https://github.com/Frontend-Archive/archive) 레포에 쌓인
스터디 회차별 발표 아티클을 **날짜순으로 모아 다이어리처럼** 넘겨보는 아카이브.
글을 쓰는 서비스가 아니라, 이미 발행된 글을 모아서 보여주는 사이트입니다.

## 화면 구성

**모바일은 한 권의 공책**, **데스크톱은 펼쳐 놓은 지면**으로 나뉩니다.

### 모바일 — 책

- `/` 는 **목차 면**입니다. 표지 정보와 회차 목록이 공책 위에 적혀 있고, 항목을 누르면 그 지면으로 넘어갑니다.
- `/p/[id]` 는 **회차 한 면**. 화면 전체가 공책이고, 위쪽에 날짜가 손글씨로 적혀 있습니다.
- 아래 조작줄에 **이전 / 목차 / 다음** 과 현재 쪽수(`3 / 6`)가 있습니다.
- 넘길 때는 **종이가 왼쪽 모서리를 축으로 돌아가는 3D 넘김**이 붙습니다.
  좌우 스와이프와 키보드 좌우 화살표도 같은 동작을 합니다.
- 넘김은 화면 안에서 처리하고 주소만 `history.pushState` 로 맞춥니다.
  덕분에 넘기는 동안 화면이 끊기지 않고, 브라우저 뒤로가기도 한 장씩 되돌아갑니다.
  직접 `/p/3` 으로 들어와도 서버가 그 지면부터 그려 줍니다(각 회차는 SSG).

### 데스크톱 — 스크롤

- `/` 는 지금까지의 레이아웃 그대로. 왼쪽 **책갈피** 목차가 따라오고 지면이 아래로 이어집니다.
- `/p/[id]` 로 들어오면 책이 화면 가운데에 한 권으로 놓입니다.

## 디자인 컨셉

'은은한 종이' 느낌의 다이어리. 과한 스큐어모피즘 없이 다음 요소로만 표현합니다.

- 크림빛 지면(`--paper`)과 잉크색 본문(`--ink`)
- 아주 옅은 괘선(`.ruled`)과 종이 얼룩(`.paper-grain`)
- 날짜 숫자에만 쓰는 명조 계열(`--font-serif`)
- 책갈피 리본 색(`--ribbon`)을 유일한 강조색으로 사용

색은 모두 CSS 변수로 정의하고 `@theme inline`을 통해 `bg-paper`, `text-ink-muted`,
`border-rule` 같은 Tailwind 유틸리티로 씁니다. 다크모드 동작은 아래
[테마](#테마) 항목에 있습니다.

## 스택

- Next.js 16 (App Router, Turbopack) / React 19 / TypeScript
- Tailwind CSS v4
- gray-matter (frontmatter 파싱)
- ESLint + Prettier

## 시작하기

```bash
yarn install
yarn dev
```

## 스크립트

| 명령어                              | 설명           |
| ----------------------------------- | -------------- |
| `yarn dev`                          | 개발 서버      |
| `yarn build`                        | 프로덕션 빌드  |
| `yarn start`                        | 빌드 결과 실행 |
| `yarn lint` / `yarn lint:fix`       | ESLint         |
| `yarn format` / `yarn format:check` | Prettier       |
| `yarn typecheck`                    | 타입 검사      |

## 구조

```
src/
├─ app/
│  ├─ layout.tsx          # 헤더/푸터, 테마 프로바이더
│  ├─ page.tsx            # 표지 + 책갈피 + 지면 목록 (서버 컴포넌트, ISR 1시간)
│  └─ globals.css         # 종이 팔레트, 괘선, 다크모드
├─ components/
│  ├─ book/               # 모바일 책 모드
│  │  ├─ book-reader.tsx      # 넘김·스와이프·주소 동기화
│  │  ├─ contents-page.tsx    # 목차 면
│  │  └─ notebook-page.tsx    # 회차 한 면
│  ├─ bookmark/           # 데스크톱 책갈피 목차
│  │  ├─ bookmark-rail.tsx    # 세로 레일
│  │  ├─ bookmark-list.tsx    # 목록
│  │  └─ use-active-date.ts   # 지금 읽고 있는 지면 추적
│  ├─ diary-page.tsx      # 회차 한 면
│  ├─ article-entry.tsx   # 글 한 줄 (미작성 자리 포함)
│  ├─ site-header.tsx / site-footer.tsx
│  └─ theme-provider.tsx / theme-toggle.tsx
├─ lib/
│  ├─ archive/            # 데이터 수집·파싱 계층
│  │  ├─ load.ts         # 실패해도 페이지는 뜨게 하는 래퍼
│  │  ├─ config.ts        # 레포 좌표, URL 빌더, 재검증 주기
│  │  ├─ types.ts         # Archive / Article 스키마
│  │  ├─ parse.ts         # frontmatter 파싱
│  │  ├─ fetch.ts         # GitHub에서 받아오기
│  │  └─ select.ts        # 연도별 그룹핑, 통계
│  ├─ date.ts             # 날짜 포맷
│  ├─ source.ts           # URL → 출처 라벨
│  └─ site.ts             # 사이트 메타
└─ scripts/dump-archives.ts  # 수집 결과 콘솔 출력
```

## 데이터

원본은 [Frontend-Archive/archive](https://github.com/Frontend-Archive/archive)의
`archives/YYYYMM.md`. 파일 하나가 스터디 한 회차이고, YAML frontmatter가 곧 데이터입니다.

```ts
interface Archive {
  id: number; // 회차 번호
  date: string; // 'YYYY-MM-DD' 스터디 진행일
  title: string; // '스터디 N회차'
  type: "on-line" | "off-line";
  articles: Article[]; // 발표자 수만큼. 순서 고정
}

interface Article {
  author: string;
  title: string; // 미작성 시 ''
  url: string; // 미작성 시 ''
  tags: string[]; // 미작성 시 []
}
```

`title` / `url` / `tags` 가 모두 비어 있으면 아직 채우지 않은 자리로 보고 '아직 기록 전'으로
표시합니다.

가져오는 방식은 두 단계입니다.

1. GitHub Contents API로 `archives/` 목록을 받아 `YYYYMM.md` 만 남깁니다 (`template/` 제외)
2. `raw.githubusercontent.com` 에서 각 파일을 받아 frontmatter를 파싱합니다

한 파일이 깨져도 나머지는 살아남고, 실패 목록은 화면에 안내로 표시됩니다.
목록 조회는 인증 없이 시간당 60회 제한이 있으므로, 필요하면 `GITHUB_TOKEN` 환경 변수를
설정하면 자동으로 사용합니다.

```bash
yarn archive:dump          # 수집 결과를 콘솔에 출력
yarn archive:dump --json   # JSON만 출력
```

페이지는 1시간마다 재검증(ISR)됩니다. 주기는 `src/lib/archive/config.ts` 의
`REVALIDATE_SECONDS` 와 `src/app/page.tsx` 의 `revalidate` 를 함께 맞춰 주세요.

시간대에 따라 날짜가 흔들리지 않도록 날짜 계산은 문자열 기준으로만 합니다
(`src/lib/date.ts`).

## 테마

**CSS가 먼저 처리하고, JS는 사용자가 직접 고른 경우에만 개입합니다.**

```css
:root {
  color-scheme: light;
  --paper: #faf7f0; /* ... */
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --paper: #14120f; /* ... */
  }
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --paper: #14120f; /* ... */
}
```

- 표시가 없으면 OS 설정을 따릅니다. JS가 하나도 없어도 첫 페인트부터 색이 맞습니다.
- 사용자가 토글하면 `<html data-theme="light|dark">` 가 붙어 OS 설정을 덮어씁니다.
- `dark:` 유틸리티는 `globals.css` 상단의 `@custom-variant dark` 가 두 경우
  (`[data-theme="dark"]`, 그리고 `data-theme="light"` 가 아닌 상태의 OS 다크)를 모두 처리합니다.

어두운 값이 두 번 적히는 대신 **`light-dark()` 같은 최신 문법에 기대지 않습니다.**
한동안 `light-dark()` 로 한 벌만 두었는데, 지원하지 않는 브라우저에서는 커스텀 속성이
통째로 무효가 되어 색이 전부 날아갑니다. 중복을 감수하고 확실한 쪽을 택했습니다.

`components/theme-provider.tsx` 는 `useSyncExternalStore` 로 `localStorage` 와 `matchMedia` 를
구독합니다. 서버 스냅샷이 따로 있어 하이드레이션 불일치가 없고, 다른 탭에서 바꾼 값도
`storage` 이벤트로 따라옵니다.

> **의도적으로 뺀 것**: 첫 페인트 전에 실행되는 인라인 `<script>` 를 두지 않았습니다.
> React 19는 컴포넌트가 렌더링한 `<script>` 를 클라이언트에서 실행하지 않고 콘솔 경고를
> 남깁니다(`next-themes` 를 걷어낸 이유이기도 합니다). OS 설정은 CSS만으로 처리되므로,
> 화면이 번쩍일 수 있는 경우는 **OS와 다른 테마를 직접 고른 사용자의 첫 로드** 한 프레임뿐입니다.

## 폰트

책 안의 글씨는 전부 **나눔손글씨 펜**입니다. `public/fonts/nanum-pen-kr.woff2` 로 self-host 하고
`--font-hand` 토큰을 통해 `font-hand` 유틸리티로 씁니다.

- 원본 3.2MB TTF에서 **한글 음절 전체(AC00–D7A3)와 라틴·기호만 남기고** 힌팅을 걷어내
  **약 448KB** 로 줄였습니다. 새 글 제목에 어떤 글자가 와도 깨지지 않습니다.
- `font-display: swap` 이라 폰트가 오기 전에는 시스템 글꼴로 먼저 읽힙니다.
- OFL 라이선스라 재배포·서브셋이 가능합니다. 출처와 다시 뽑는 방법은
  [public/fonts/README.txt](public/fonts/README.txt) 에 있습니다.

데스크톱 목록과 제목 일부는 시스템 폰트 스택(`--font-sans`, `--font-serif`)을 씁니다.
빌드가 외부 네트워크에 의존하지 않도록 `next/font/google` 은 쓰지 않습니다.
