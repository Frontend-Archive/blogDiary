# blogDiary

[Frontend-Archive/archive](https://github.com/Frontend-Archive/archive) 레포에 쌓인
스터디 회차별 발표 아티클을 **날짜순으로 모아 다이어리처럼** 넘겨보는 아카이브.
글을 쓰는 서비스가 아니라, 이미 발행된 글을 모아서 보여주는 사이트입니다.

**https://ksh-blog-diary.netlify.app**

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
  머리말과 책갈피 모두 `sticky` 라 스크롤을 따라옵니다.
- 지면 위에 **태그 칩**이 많이 쓰인 순으로 깔립니다. 칩을 누르면 그 태그가 붙은 글만 남고,
  같은 칩을 다시 누르면 그것만 풀립니다. `전체 보기` 는 한 번에 다 풉니다.
  본문에 적힌 태그를 눌러도 같습니다.
- **여러 개를 고를 수 있고, 합집합**(고른 태그 중 하나라도 붙은 글)으로 걸러집니다.
  태그 대부분이 글 한 편에만 붙어 있어 교집합으로 잡으면 거의 항상 빈 목록이 됩니다.
- 필터가 걸리면 **책갈피 목차도 함께 걸러져** 남은 회차만 보입니다.
- 태그는 회차가 쌓일수록 늘어나므로 24개까지만 펼쳐 두고 나머지는 `+n개 더` 로 접어 둡니다.
  접힌 뒤쪽에 있더라도 **고른 태그는 칩 줄에 끌어와** 계속 보여 줍니다.
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
│  ├─ page.tsx            # 표지 + 지면 목록 (서버 컴포넌트, ISR 1시간)
│  └─ globals.css         # 종이 팔레트, 괘선, 다크모드
├─ components/
│  ├─ book/               # 모바일 책 모드
│  │  ├─ book-reader.tsx      # 넘김·스와이프·주소 동기화
│  │  ├─ contents-page.tsx    # 목차 면
│  │  ├─ notebook-page.tsx    # 회차 한 면
│  │  └─ use-page-turn-sound.ts  # 책장 넘기는 소리
│  ├─ bookmark/           # 데스크톱 책갈피 목차
│  │  ├─ bookmark-rail.tsx    # 세로 레일
│  │  ├─ bookmark-list.tsx    # 목록
│  │  └─ use-active-date.ts   # 지금 읽고 있는 지면 추적
│  ├─ tag/
│  │  └─ tag-chips.tsx       # 태그 칩 (필터 조작부)
│  ├─ archive-board.tsx   # 데스크톱 지면 목록 + 태그 필터 상태
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
│  │  ├─ select.ts        # 연도별 그룹핑, 통계
│  │  └─ tags.ts          # 태그 집계, 태그로 걸러내기
│  ├─ date.ts             # 날짜 포맷
│  └─ site.ts             # 사이트 메타
├─ hooks/
│  └─ use-sfx.ts          # 짧은 효과음 재생 (넘김 소리 / 물방울 소리가 함께 씀)
└─ scripts/dump-archives.ts  # 수집 결과 콘솔 출력
```

### 어떻게 나눴나

**`lib/` 는 React 를 모릅니다.** `import ... from "react"` 가 한 줄도 없는 순수 TypeScript 입니다.
수집·파싱·집계·필터가 전부 여기 있고, 화면은 그 결과를 받아 그리기만 합니다.
덕분에 **데스크톱과 모바일이 같은 함수를 그대로 나눠 씁니다** — 태그 필터가 양쪽에서
똑같이 동작하는 건 로직이 한 벌뿐이기 때문입니다.

**`components/` 는 화면 단위로 묶었습니다.** `book/` 은 모바일 책, `bookmark/` 는 데스크톱
세로 목차, `tag/` 는 태그 칩. 여러 곳에서 쓰는 것(`theme-*`, `site-*`)만 밖에 둡니다.

**`app/` 에는 데이터를 가져오는 일과 뼈대만** 둡니다. `page.tsx` 는 회차를 받아
아래로 넘기는 것까지만 하고, 화면을 그리는 건 전부 `components/` 입니다.

## 되풀이되는 패턴

거창한 아키텍처는 없습니다. 다만 같은 판단이 여러 번 반복돼서, 그 기준을 적어 둡니다.

### 1. 클라이언트 경계는 '함께 바뀌는 것'의 바깥에 둔다

`"use client"` 가 붙은 파일은 10개뿐이고 `app/` 의 세 페이지는 전부 서버 컴포넌트입니다.
경계를 어디에 그을지는 **무엇이 같이 바뀌어야 하는가**로 정했습니다.

태그를 고르면 **책갈피 목차와 지면 목록이 동시에** 달라져야 합니다. 그래서 둘 중
하나가 아니라 **둘을 감싸는** `archive-board.tsx` 가 상태를 쥡니다. 따로 두면
"목록은 걸러졌는데 책갈피는 그대로"인 상태가 생깁니다.

```
page.tsx (서버)            ← 데이터를 가져오는 곳
└─ ArchiveBoard (클라)     ← 필터 상태를 쥔 곳
   ├─ TagChips             ← 상태를 바꾸는 곳
   ├─ BookmarkRail         ← 상태를 받는 곳
   └─ DiaryPage[]          ← 상태를 받는 곳
```

### 2. 파생된 값은 저장하지 않고 계산한다

"걸러낸 회차 목록"을 `useState` 로 따로 들고 있지 않습니다.
**고른 태그만 상태**고, 나머지는 매번 계산합니다.

```ts
const [activeTags, setActiveTags] = useState<string[]>([]);
const pages = useMemo(
  () => filterByTags(archives, activeTags),
  [archives, activeTags],
);
```

상태를 두 벌 들면 둘이 어긋나는 순간이 반드시 생깁니다. 계산이 무거워진 적도 없고,
무거워지면 그때 `useMemo` 를 손보면 됩니다.

### 3. 원본은 건드리지 않고 새로 만들어 돌려준다

`filterByTags` 는 `archives` 를 자르지 않고 **새 배열**을 만듭니다.
그래서 필터를 풀면 원본이 그대로 살아 있습니다.

모바일이 이 성질을 가장 잘 씁니다 — 걸러낸 결과가 그대로 **책의 페이지 배열**이 되어,
`pages` 하나만 갈아끼우면 쪽수·넘김·스와이프·뒤로가기가 전부 따라옵니다.

### 4. CSS 가 할 수 있으면 CSS 가 한다

- **테마**: OS 설정은 CSS 가 처리하고, JS 는 사용자가 직접 고른 경우에만 개입합니다.
- **반응형**: 화면 폭을 JS 로 재지 않습니다. 모바일 책과 데스크톱 지면을 **둘 다 그려 놓고**
  `lg:hidden` / `hidden lg:block` 으로 가립니다. 서버가 이미 양쪽을 다 그려 보내므로
  하이드레이션 불일치도, 화면이 한 번 튀는 일도 없습니다.
- **아이콘 전환**: 해/달 아이콘도 `dark:hidden` / `hidden dark:block` 입니다.
  JS 상태로 갈아끼우면 서버와 클라이언트가 다른 아이콘을 그려 경고가 납니다.

### 5. 같이 움직여야 하는 값은 CSS 변수 하나로 묶는다

숫자 두 개가 짝을 이뤄야 하는데 따로 적어 두면, 나중에 한쪽만 고치고 어긋납니다.
실제로 겪었고, 그래서 계산으로 묶었습니다.

```css
/* 자국 폭만 정하면 퍼지는 거리는 따라온다 */
--ink-feather-max: 22%;
@keyframes ink-drop {
  to {
    --ink-spread: calc(100% + var(--ink-feather-max));
  }
}
```

`.marker` 의 진하기(`--marker-ink`)도 같은 이유로 변수 하나입니다. 값 한 곳만 바꾸면
데스크톱 본문과 모바일 지면이 같이 움직입니다.

### 6. 실패는 삼키되, 어디서 삼킬지는 정해 둔다

세 겹으로 나눠 받습니다.

| 어디서     | 무엇을             | 결과                                     |
| ---------- | ------------------ | ---------------------------------------- |
| `parse.ts` | 값이 비거나 오타   | 기본값으로 흡수 (예외는 `id`·`date` 뿐)  |
| `fetch.ts` | 파일 하나가 깨짐   | `Promise.allSettled` 로 그것만 빼고 진행 |
| `load.ts`  | 수집이 통째로 실패 | 빈 배열 + 안내 문구                      |

어느 경우에도 **페이지 자체는 뜹니다.** 원본이 사람이 손으로 채우는 레포라
깨진 입력을 전제로 깔고 갑니다.

### 7. 효과음은 음원을 크게 굽고 음량은 코드에서 줄인다

음원은 피크 **-3dBFS** 로 여유 있게 구워 두고, 실제 음량은 `useSfx` 의 `volume` 으로 낮춥니다.
파일을 작게 만들어 두면 나중에 키울 여지가 없어 다시 인코딩해야 하고, 그때마다 손실이 쌓입니다.

받은 음원은 두 번 다 손질이 필요했습니다 — 넘김 소리는 **-27dBFS 로 너무 작게** 녹음돼 있었고,
물방울 소리는 **0.3초가 무음**이었습니다. 어느 쪽이든 파형을 먼저 재 보고 자를 구간을 정합니다.

### 7. 연출은 없어도 되게 만든다

View Transitions, 3D 넘김, 잉크 번짐은 전부 **없어도 동작에 지장이 없도록** 붙였습니다.

- `startViewTransition` 이 없으면 → 테마가 즉시 바뀝니다
- `prefers-reduced-motion` 이면 → 애니메이션 없이 바로
- 키보드로 눌렀으면 → 찍을 지점이 없으니 고르는 단계를 건너뜁니다

## 데이터

### 원본은 어떻게 생겼나

[Frontend-Archive/archive](https://github.com/Frontend-Archive/archive)의
`archives/YYYYMM.md` 파일 하나가 **스터디 한 회차**입니다.
YAML frontmatter가 곧 데이터이고, 그 아래 본문은 사람이 읽는 메모입니다.

```yaml
---
id: 6
date: "2026-08-22"
title: "스터디 6회차"
type: "off-line"
articles:
  - author: "권시현"
    title: "[디자인 패턴] 팩토리 패턴과 프로토타입 패턴을 JS로 이해해보자!"
    url: "https://kwonsean.tistory.com/37"
    tags: ["디자인패턴", "팩토리 패턴", "프로토타입 패턴"]

  - author: "민준경" # 아직 안 쓴 자리는 title/url/tags 가 비어 있다
    title: ""
    url: ""
    tags: []
---
스터디 6회차 (2026.08.22)
```

이걸 앱 안에서는 이 모양으로 다룹니다.

```ts
interface Archive {
  id: number; // 회차 번호
  date: string; // 'YYYY-MM-DD' 스터디 진행일
  title: string; // '스터디 N회차'
  type: "on-line" | "off-line";
  articles: Article[]; // 발표자 수만큼. 순서 고정
  slug: string; // 파일명에서 온 'YYYYMM'
  summary: string; // frontmatter 아래 본문 첫 줄
  sourceUrl: string; // 원본 md 링크 (?plain=1)
}

interface Article {
  author: string;
  title: string; // 미작성 시 ''
  url: string; // 미작성 시 ''
  tags: string[]; // 미작성 시 []
}
```

`title` 과 `url` 이 비어 있으면 **아직 채우지 않은 자리**로 봅니다(`isFilled()`).
이 판정이 화면 곳곳에서 쓰입니다 — 지면에는 쓴 글만 늘어놓고 안 쓴 사람은 아래에
이름만 모으고, `4/4` 같은 표시도 여기서 나옵니다.

### 전체 흐름

```
GitHub 레포 (archives/YYYYMM.md)
      │
      │  fetch.ts    ① 목록 조회 → ② 파일별로 병렬 수집
      ▼
  md 원문
      │  parse.ts    frontmatter → Archive (모자란 값은 기본값으로 흡수)
      ▼
  Archive[]  ← 날짜 오름차순
      │  load.ts     통째로 실패해도 빈 배열 + 안내 문구로 바꿔 돌려준다
      ▼
  page.tsx (서버 컴포넌트, ISR 1시간)
      │
      ├─ select.ts   groupByYear / summarize  → 책갈피 목차, 표지 통계
      └─ tags.ts     collectTags / filterByTags → 태그 칩, 필터
```

### ① 가져오기 — 두 단계

1. **GitHub Contents API**로 `archives/` 의 파일 목록을 받아 `YYYYMM.md` 만 남깁니다.
   정규식(`ARCHIVE_FILENAME`)으로 거르므로 `template/` 같은 건 자연히 빠집니다.
2. 남은 파일을 **`raw.githubusercontent.com`** 에서 각각 받아 파싱합니다.

목록 조회만 API를 쓰는 이유는 **거기서만 "어떤 파일이 있는지"를 알 수 있기** 때문입니다.
내용은 raw로 받으면 API 요청 한도를 쓰지 않습니다. 인증 없이 시간당 60회 제한이 있어,
`GITHUB_TOKEN` 환경 변수가 있으면 자동으로 붙여 넉넉하게 씁니다.

파일 수집은 `Promise.allSettled` 라서 **한 파일이 깨져도 나머지는 살아남습니다.**
실패 목록은 화면 위쪽에 "n개 회차를 읽지 못했습니다"로 표시됩니다.

### ② 가공 — 느슨하게 흡수한다

`parse.ts` 의 원칙은 하나입니다. **원본은 사람이 손으로 채우는 레포**라 값이 비거나
빠지거나 오타가 날 수 있으니, **실패로 끝내기보다 안전한 기본값으로 흡수하고**
정말 치명적인 것만 예외로 던집니다.

| 상황                                          | 처리                                    |
| --------------------------------------------- | --------------------------------------- |
| `id` 가 정수가 아님                           | **예외** — 회차를 식별할 수 없다        |
| `date` 가 `YYYY-MM-DD` 가 아님                | **예외** — 날짜순 정렬이 무너진다       |
| YAML이 `date` 를 `Date` 객체로 캐스팅         | `toISOString().slice(0,10)` 으로 되돌림 |
| `type` 이 오타 · 빈 값 · 따옴표가 섞인 문자열 | `off-line` 으로 흡수                    |
| `title` 없음                                  | `스터디 N회차` 로 채움                  |
| `articles` 가 배열이 아님                     | 빈 배열                                 |
| `tags` 가 배열이 아님                         | 빈 배열                                 |

즉 **예외는 `id` 와 `date` 둘뿐**이고, 나머지는 화면이 깨지지 않는 선에서 흡수합니다.
그렇게 던져진 예외도 위의 `allSettled` 에 걸려 그 파일만 빠집니다.

`load.ts` 는 한 겹 더 감쌉니다. 네트워크가 끊기거나 API 한도에 걸려 **수집이 통째로
실패해도** 빈 배열과 안내 문구를 돌려주기 때문에, 페이지 자체는 항상 뜹니다.

```ts
// load.ts — 수집이 실패해도 페이지는 뜨게 한다
try {
  return await fetchArchives();
} catch (cause) {
  return {
    archives: [],
    failures: [],
    error: `아카이브를 가져오지 못했습니다. ...`,
  };
}
```

### ③ 화면이 쓰는 형태로 — select.ts

`Archive[]` 를 그대로 쓰기 어려운 곳들이 있어 파생 형태를 따로 만듭니다.

- `groupByYear()` → `[{ year: '2026', sessions: [...] }]` — 책갈피 목차가 연도로 묶여 있어서
- `summarize()` → 회차 수, 쓴 글 수, 전체 칸 수, 첫/마지막 날짜 — 표지의 한 줄 통계

### 기타

```bash
yarn archive:dump          # 수집 결과를 콘솔에 출력
yarn archive:dump --json   # JSON만 출력
```

페이지는 1시간마다 재검증(ISR)됩니다. 주기는 `src/lib/archive/config.ts` 의
`REVALIDATE_SECONDS` 와 `src/app/page.tsx` 의 `revalidate` 를 함께 맞춰 주세요.
(Next의 세그먼트 설정은 정적으로 분석되어 리터럴이어야 해서 한 곳으로 못 모읍니다.)

시간대에 따라 날짜가 흔들리지 않도록 날짜 계산은 문자열 기준으로만 합니다
(`src/lib/date.ts`).

## 태그

### 로직은 두 함수가 전부

`src/lib/archive/tags.ts` 에 순수 함수 두 개만 있고, 데스크톱과 모바일이 이걸 같이 씁니다.

```ts
// 태그별로 몇 편인지 세어 많이 쓰인 순으로
collectTags(archives): { tag: string; count: number }[]

// 고른 태그로 걸러낸 회차 목록
filterByTags(archives, tags): Archive[]
```

`collectTags` 는 **쓴 글만** 셉니다(안 채운 자리는 태그도 없음). 한 글에 같은 태그가
두 번 적혀 있어도 `new Set` 으로 한 번만 세고, `count` 내림차순 → 이름 오름차순으로
정렬합니다. 그래서 **칩이 자주 쓰인 태그부터** 깔립니다.

`filterByTags` 는 걸러낼 때 두 겹으로 작동합니다.

```ts
archives
  .map((archive) => ({
    ...archive,
    // ① 회차 안에서 그 태그가 붙은 글만 남기고
    articles: archive.articles.filter((a) => isFilled(a) && a.tags.some(...)),
  }))
  // ② 남은 글이 없는 회차는 통째로 뺀다
  .filter((archive) => archive.articles.length > 0);
```

원본을 건드리지 않고 **새 배열을 만들어 돌려주는 게 핵심**입니다. 덕분에 필터를 풀면
원본이 그대로 살아 있고, 화면은 "걸러낸 결과"만 그리면 됩니다.

### 왜 교집합이 아니라 합집합인가

여러 태그를 고르면 **그중 하나라도 붙은 글**이 남습니다(합집합).

현재 태그 35개 중 **33개가 글 한 편에만** 붙어 있습니다. 교집합으로 잡으면 두 개만
골라도 거의 항상 빈 목록이 되어 기능이 무의미해집니다. 태그가 훨씬 촘촘해지면
그때 다시 볼 문제입니다.

### 필터 상태는 어디에 있나

필터는 **클라이언트 상태**입니다. 다만 서버 렌더링을 포기한 건 아닙니다.

`page.tsx` 는 서버 컴포넌트로 남아 데이터를 받아 오고, 그 아래 **필터가 영향을 주는
범위만** 클라이언트 컴포넌트로 감쌉니다.

|          | 상태를 쥔 곳           | 필터가 바꾸는 것                    |
| -------- | ---------------------- | ----------------------------------- |
| 데스크톱 | `archive-board.tsx`    | 태그 칩 + 책갈피 목차 + 지면 목록   |
| 모바일   | `book/book-reader.tsx` | 목차 면 + **책에 꽂히는 지면 자체** |

책갈피와 지면이 **함께** 바뀌어야 해서 둘을 한 컴포넌트가 쥐고 있습니다.
따로 두면 "목록은 걸러졌는데 책갈피는 그대로"인 상태가 생깁니다.

모바일이 특히 재미있는데, 걸러낸 결과가 그대로 **책의 페이지 배열**이 됩니다.

```ts
const pages = useMemo(
  () => filterByTags(archives, activeTags),
  [archives, activeTags],
);
```

`pages` 하나만 갈아끼우면 목차·쪽수(`1 / 4`)·넘김·스와이프·뒤로가기가 전부 따라옵니다.
`#React` 를 고르면 4회차 다음이 6회차가 되는 식으로, **건너뛰기가 공짜로** 딸려옵니다.

> 전체 데이터를 클라이언트로 보내는 게 낭비처럼 보일 수 있는데, 모바일 책 뷰어가
> 이미 `archives` 전체를 받고 있어 **추가 비용이 없습니다.** 덕분에 필터를 눌러도
> 네트워크 요청이 없고 페이지는 계속 정적(ISR)으로 남습니다.

### 고른 태그를 눈에 보이게 하는 법

본문에 적힌 태그는 형광펜 자국(`.marker`)으로 표시되는데, **글자색은 그대로 두고
자국의 진하기만** 바꿔 고른 것을 구분합니다. 한 줄 안에서 글자가 울긋불긋해지면
오히려 읽기 나빠지기 때문입니다.

```css
.marker {
  --marker-ink: 20%;
} /* 기본 */
.marker-soft {
  --marker-ink: 10%;
} /* 안 고른 태그 */
.marker-strong {
  --marker-ink: 55%;
} /* 고른 태그 */
```

진하기를 CSS 변수 하나로 뺐기 때문에 **데스크톱 본문과 모바일 지면이 같이 움직입니다.**

칩이 늘어나는 문제도 양쪽이 다르게 풉니다. 데스크톱은 24개까지 펼치고 `+n개 더` 로
접지만, 모바일은 **높이로 잘라 한 줄만** 남깁니다(`max-h-10 overflow-hidden`).
개수로 자르면 `#JS` 와 `#계층형 아키텍처` 의 폭이 3배 넘게 차이 나서 한 줄이 보장되지
않기 때문입니다. 둘 다 **고른 태그는 앞으로 끌어와** 접힌 상태에서도 보이게 합니다.

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

### 잉크 번짐 전환

테마 전환은 **두 단계**입니다. 버튼을 누르면 바로 바뀌지 않고 '잉크를 떨어뜨릴 곳을
고르는' 상태가 되고, **화면 아무 데나 누르면 그 지점에서 새 테마가 번져 나갑니다.**
Esc, 안내의 `취소`, 또는 (키보드로) 버튼을 다시 누르면 빠져나옵니다.

[View Transitions API](https://developer.mozilla.org/docs/Web/API/View_Transition_API)로
바뀌기 전/후 화면을 한 장씩 찍고, 새 화면을 마스크로 가린 뒤 그 구멍을 넓힙니다.
찍은 좌표는 `--ink-x` / `--ink-y` 로 넘기고 나머지 그림은 전부 CSS가 그립니다.

```ts
root.style.setProperty("--ink-x", `${x}px`);
root.style.setProperty("--ink-y", `${y}px`);
document.startViewTransition(() => setTheme(next));
```

몇 가지 함정이 있었습니다.

- **`setTheme` 이 동기여야 합니다.** `startViewTransition(cb)` 은 **cb 가 끝난 시점의 DOM** 을
  '바뀐 후'로 찍습니다. 리렌더 뒤 `useEffect` 에서 `data-theme` 을 붙이면 그때는 아직
  색이 그대로라, 같은 화면을 두 장 찍어 아무 일도 일어나지 않습니다.
  그래서 `theme-provider.tsx` 의 `setTheme` 이 `applyTheme()` 로 **먼저 DOM 을 건드립니다.**
- **덮개는 `<body>` 로 포털을 냅니다.** 버튼이 놓인 머리말에 `backdrop-blur` 가 걸려 있는데,
  `backdrop-filter` 는 `position: fixed` 자손의 기준 박스가 되어 버립니다.
  그냥 두면 덮개가 화면이 아니라 머리말 크기로 잘립니다.
- **퍼지는 거리를 118% 에서 멈춥니다.** 자국 가장자리(18%)를 빼면 딱 100%,
  즉 화면에서 가장 먼 모서리입니다. 더 벌리면 진작 다 덮어 놓고 애니메이션만 남아 돌아
  움직이지도 않는 화면을 붙들고 있게 됩니다(전환 중에는 페이지가 반응하지 않습니다).

지원하지 않는 브라우저(Safari·Firefox)나 `prefers-reduced-motion` 에서는 고르는 단계 없이
누르는 즉시 갈아끼웁니다. 키보드로 버튼을 눌렀을 때(`event.detail === 0`)도 찍을 지점이
없으므로 버튼 자리에서 바로 번지게 합니다.

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
