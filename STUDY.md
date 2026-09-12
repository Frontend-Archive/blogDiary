# 공부할 것

이 프로젝트에 쓴 것 중 익숙하지 않았던 것들.
**뭘 검색해야 하는지** 알아보려고 적어 둔 목록입니다. 자세한 건 링크에서.

⭐ = 이건 좀 제대로 봐야 함

---

## React

### ⭐ useSyncExternalStore

React **밖에 있는 값**(`localStorage`, `matchMedia`, 전역 변수 등)을 React 가 따라가게 하는 훅.

```ts
useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
//                   ①바뀌면알림  ②지금값읽기   ③서버에선이걸로
```

`useState` 로 하면 서버엔 `localStorage` 가 없어서 하이드레이션 불일치가 납니다.
이 훅은 **서버 전용 스냅샷을 따로 받아서** 그 문제를 구조적으로 막습니다.

- 쓴 곳: [theme-provider.tsx](src/components/theme-provider.tsx)
- https://react.dev/reference/react/useSyncExternalStore

**같이 볼 것**: `storage` 이벤트는 **값을 바꾼 그 탭에서는 안 터집니다.** 다른 탭에서만.
그래서 같은 탭용 알림 통로를 따로 만들어야 합니다.

### 서버 컴포넌트 / 클라이언트 컴포넌트

`"use client"` 가 붙으면 그 아래는 전부 클라이언트. 안 붙으면 서버에서만 돕니다.
**경계를 어디에 긋느냐**가 설계의 핵심이었습니다.

- 쓴 곳: [page.tsx](src/app/page.tsx)(서버) → [archive-board.tsx](src/components/archive-board.tsx)(클라)
- https://react.dev/reference/rsc/server-components

### createPortal

자식을 **DOM 트리의 다른 곳**에 그립니다. 부모의 CSS 제약(스태킹, 클리핑)에서 벗어날 때 씁니다.

- 쓴 곳: [theme-toggle.tsx](src/components/theme-toggle.tsx) — 화면 전체를 덮는 판
- https://react.dev/reference/react-dom/createPortal

### StrictMode 의 이펙트 2회 실행

개발 모드에서만 `useEffect` 가 **마운트 → 정리 → 마운트** 로 두 번 돕니다.
"처음인가?" 를 플래그로 재면 두 번째에 잘못 걸립니다. 실제로 당했습니다.

- https://react.dev/reference/react/StrictMode

---

## Next.js (App Router)

### ⭐ 파일 규약 — import 하지 않는데 알아서 걸린다

App Router 는 **파일 위치와 이름 자체가 API** 입니다.
`RootLayout` 을 어디서도 import 하지 않는데 모든 페이지를 감싸는 게 그래서입니다.

```
src/app/
├─ layout.tsx        ← 이 위치 + 이 파일명이 곧 약속
├─ page.tsx          → /
└─ p/[id]/page.tsx   → /p/1, /p/2, ...
```

**이름 규칙이 두 가지로 갈립니다.**

|                            | 이름                 | 규칙                                            |
| -------------------------- | -------------------- | ----------------------------------------------- |
| 레이아웃 · 페이지 컴포넌트 | `RootLayout`, `Home` | **아무거나** — Next 는 `export default` 만 본다 |
| `metadata`                 | `metadata`           | **정확히 이 이름**                              |
| `revalidate`               | `revalidate`         | **정확히 이 이름**                              |

`RootLayout` 이라는 이름은 관례일 뿐이라 바꿔도 동작합니다.
반대로 `metadata` 는 Next 가 그 이름을 찾아서 `<head>` 를 만들기 때문에 못 바꿉니다.

### layout 은 겹겹이 쌓인다

경로 깊이를 따라 중첩됩니다.

```
app/layout.tsx        ← 모든 경로
app/p/layout.tsx      ← /p/* 만 추가로 감쌈
app/p/[id]/page.tsx
```

`/p/4` 는 `RootLayout > p/layout > page` 순으로 감싸집니다.
**루트 레이아웃만 `<html>`, `<body>` 를 가지고** 나머지는 그 안쪽 조각입니다.
루트 레이아웃은 필수라 지우면 빌드가 실패합니다.

### 아직 안 쓴 규약 파일들

이름만 맞춰 파일을 두면 자동으로 걸립니다.

| 파일            | 역할                                             |
| --------------- | ------------------------------------------------ |
| `loading.tsx`   | 그 구간 로딩 화면 (Suspense 자동 연결)           |
| `error.tsx`     | 그 구간 에러 화면                                |
| `not-found.tsx` | `notFound()` 호출 시                             |
| `route.ts`      | API 엔드포인트                                   |
| `template.tsx`  | layout 과 비슷하지만 이동할 때마다 새로 만들어짐 |

> [p/[id]/page.tsx](src/app/p/[id]/page.tsx) 에서 `notFound()` 를 부르고 있는데
> `not-found.tsx` 가 없어서 지금은 Next 기본 404 화면이 뜹니다.

- https://nextjs.org/docs/app/api-reference/file-conventions

### ⭐ ISR (`revalidate`)

정적으로 만들어 두되 **N초마다 다시 만드는** 방식.
원본 레포에 새 글이 올라오면 재배포 없이 1시간 안에 반영되는 게 이것 덕분입니다.

```ts
export const revalidate = 3600; // 리터럴이어야 함 (정적 분석)
```

- 쓴 곳: [page.tsx](src/app/page.tsx)
- https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration

### ⭐ Cache Components — 이 프로젝트가 쓰는 방식이 과도기다

**지금 코드는 '이전 모델' 입니다.** 동작에 문제는 없지만, 알고는 있어야 합니다.

Next 16 부터 `cacheComponents` 라는 새 캐시 모델이 들어왔습니다.
켜면 `revalidate`, `dynamic`, `dynamicParams`, `fetchCache` 가 **전부 무시됩니다.**

```
node_modules/next/dist/docs/.../route-segment-config/index.md
  v16.0.0 — `dynamic`, `dynamicParams`, `revalidate`, `fetchCache`
            removed when Cache Components is enabled.
```

기존 방식 문서도 `caching-without-cache-components.md`
(= "Cache Components 안 쓸 때") 라는 이름으로 밀려났습니다.

**무엇이 달라지나**

|           | 이전 모델 (지금)          | Cache Components                            |
| --------- | ------------------------- | ------------------------------------------- |
| 기본값    | 정적 (캐시가 기본)        | **동적** (캐시를 직접 지정)                 |
| 캐시 단위 | 라우트 / fetch            | **함수 · 컴포넌트 · 페이지**                |
| 지정 방법 | `export const revalidate` | `'use cache'` + `cacheLife()`               |
| 렌더링    | 페이지 통째로             | 정적 껍데기 먼저 + 동적 부분 스트리밍 (PPR) |

**지금 코드를 옮긴다면**

```ts
// 지금 (이전 모델)
export const revalidate = 3600; // page.tsx
fetch(url, { next: { revalidate: 3600 } }); // fetch.ts

// Cache Components 켠 뒤
import { cacheLife } from "next/cache";

async function getArchives() {
  "use cache";
  cacheLife("hours"); // 1시간짜리 프리셋
  const res = await fetch(url); // 이 안의 fetch 는 자동으로 캐시됨
  return res.json();
}
```

`use cache` 범위 안의 fetch 는 **자동으로 캐시되므로** `next: { revalidate }` 가 필요 없어집니다.

**`cacheLife` 프리셋** (직접 숫자를 안 쓰고 이름으로 고름)

| 프로필    | revalidate | 용도           |
| --------- | ---------- | -------------- |
| `seconds` | 1초        | 실시간 데이터  |
| `minutes` | 1분        | 자주 바뀌는 것 |
| `hours`   | 1시간      | 하루에 몇 번   |
| `days`    | 1일        | 매일           |
| `max`     | 30일       | 거의 안 바뀜   |

- 켜는 법: `next.config.ts` 에 `cacheComponents: true`
- 번들 문서: `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`
- https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents

> **지금 당장은 안 켜도 됩니다.** 안 켜면 이전 모델이 그대로 돕니다.
> 다만 나중에 켤 때 `page.tsx` 의 `revalidate` 와 `fetch.ts` 의 `next` 옵션을
> 둘 다 손봐야 한다는 것만 기억해 두면 됩니다.

### generateStaticParams

동적 경로(`/p/[id]`)를 빌드 때 미리 다 만들어 두는 것(SSG).

- 쓴 곳: [p/[id]/page.tsx](src/app/p/[id]/page.tsx)

---

## 브라우저 API

### ⭐ View Transitions API

화면이 바뀌기 **전/후를 한 장씩 찍어서** 그 사이를 애니메이션해 주는 API.

```ts
document.startViewTransition(() => {
  /* DOM 바꾸기 */
});
```

**함정**: 콜백이 **끝난 시점의 DOM** 을 '바뀐 후'로 찍습니다.
React 상태 갱신은 비동기라, `setState` 만 부르면 아직 안 바뀐 화면을 두 장 찍습니다.

- 쓴 곳: [theme-toggle.tsx](src/components/theme-toggle.tsx) + [globals.css](src/app/globals.css) 의 `::view-transition-*`
- https://developer.mozilla.org/docs/Web/API/View_Transition_API

### history.pushState / popstate

페이지를 다시 안 불러오고 **주소만** 바꾸기. 뒤로가기는 `popstate` 로 받습니다.

- 쓴 곳: [book-reader.tsx](src/components/book/book-reader.tsx) — 책장 넘김
- https://developer.mozilla.org/docs/Web/API/History/pushState

### 터치 이벤트의 손가락 목록 세 가지

`changedTouches` 는 "변경 내용"이 아니라 **이번 이벤트에서 상태가 바뀐 손가락 목록**입니다.

| 목록             | 담고 있는 것                                                    |
| ---------------- | --------------------------------------------------------------- |
| `touches`        | 지금 화면에 **닿아 있는** 모든 손가락                           |
| `targetTouches`  | 그중 이 요소 위에 있는 손가락                                   |
| `changedTouches` | 이번 이벤트에서 **상태가 바뀐** 손가락 (닿음 · 움직임 · **뗌**) |

**`touchend` 에서는 반드시 `changedTouches` 를 써야 합니다.**
손가락을 뗀 순간이라 `touches` 에는 이미 없어서, `touches[0]` 은 `undefined` 입니다.

```ts
onTouchStart → event.touches[0];        // 손가락이 화면에 있음
onTouchEnd → event.changedTouches[0]; // 손가락이 이미 떨어짐
```

**쓴 곳** — [book-reader.tsx](src/components/book/book-reader.tsx) 의 스와이프.
시작/끝 좌표를 빼서 방향을 구하고, 두 조건으로 오작동을 막습니다.

```ts
if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
//  60px 미만 = 그냥 탭        가로가 세로의 1.5배 미만 = 세로 스크롤
```

`[0]` 만 보는 건 첫 손가락만 쓰기 때문입니다.
핀치 줌 같은 걸 만들면 `touches[0]`, `touches[1]` 을 둘 다 봐야 합니다.

- https://developer.mozilla.org/docs/Web/API/TouchEvent/changedTouches

### matchMedia

미디어 쿼리를 **JS 에서** 검사하거나 구독하기.

```ts
window.matchMedia("(prefers-color-scheme: dark)").matches;
```

- 쓴 곳: [theme-provider.tsx](src/components/theme-provider.tsx), [use-sfx.ts](src/hooks/use-sfx.ts)

### 오디오 자동재생 정책

`audio.play()` 는 **사용자 조작에서 시작된 경우에만** 허용됩니다.
안 그러면 Promise 가 reject 되므로 `.catch()` 로 삼켜야 합니다.

- 쓴 곳: [use-sfx.ts](src/hooks/use-sfx.ts)

---

## CSS

### ⭐ position: sticky 와 부모 박스

`sticky` 는 **부모 박스 안에서만** 붙어 있습니다.
부모 높이가 자기 높이와 같으면 붙어 있을 여유가 0 이라 그냥 밀려 올라갑니다.
`overflow: hidden`, `transform`, `filter` 를 가진 조상도 범인이 됩니다.

- 겪은 곳: [site-header.tsx](src/components/site-header.tsx)

### ⭐ backdrop-filter 가 fixed 를 가둔다

`backdrop-filter` 가 걸린 요소는 **`position: fixed` 자손의 기준 박스**가 됩니다.
`fixed inset-0` 을 넣어도 화면이 아니라 그 요소 크기로 잘립니다.

- 겪은 곳: [site-header.tsx](src/components/site-header.tsx) 의 `backdrop-blur`
- 검색어: `containing block`, `backdrop-filter creates containing block`

### @property (등록된 커스텀 속성)

CSS 변수에 **타입을 알려주면** 애니메이션이 됩니다.
안 알려주면 그라데이션 색 위치 같은 건 중간값 없이 툭 튑니다.

```css
@property --ink-spread {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}
```

- 쓴 곳: [globals.css](src/app/globals.css)
- https://developer.mozilla.org/docs/Web/CSS/@property

### mask-image

이미지/그라데이션으로 **보일 영역을 오려내기.** 잉크 번짐이 이걸로 만들어졌습니다.

- https://developer.mozilla.org/docs/Web/CSS/mask-image

### 3D 변환

`perspective`, `transform-style: preserve-3d`, `transform-origin`, `backface-visibility`.
책장 넘김이 이 조합입니다.

- 쓴 곳: [globals.css](src/app/globals.css) 의 `.book-*`

### color-mix()

색을 섞습니다. 팔레트 변수 하나로 투명도만 다르게 쓸 때 편합니다.

```css
color-mix(in srgb, var(--ribbon) 20%, transparent)
```

### prefers-color-scheme / prefers-reduced-motion

OS 설정을 CSS 에서 읽는 미디어 쿼리. 다크모드와 애니메이션 폴백에 씁니다.

> `light-dark()` 라는 신문법도 있는데 **안 썼습니다.**
> 지원 안 하는 브라우저에서 커스텀 속성이 통째로 무효가 되어 색이 전부 날아갑니다.

---

## Tailwind CSS v4

설정 파일(`tailwind.config.js`)이 없어지고 **CSS 안에서** 설정합니다.

```css
@theme inline {
  --color-paper: var(--paper);
} /* → bg-paper 유틸리티 생성 */
@custom-variant dark {
  ...;
} /* → dark: 변형 직접 정의 */
```

- 쓴 곳: [globals.css](src/app/globals.css)
- https://tailwindcss.com/docs/theme

---

## 기타

### Promise.allSettled

`Promise.all` 은 **하나만 실패해도 전부 실패**합니다.
`allSettled` 는 전부 기다린 뒤 성공/실패를 각각 알려줍니다.
파일 하나가 깨져도 나머지를 살리려면 이게 맞습니다.

- 쓴 곳: [fetch.ts](src/lib/archive/fetch.ts)

### localeCompare — 언어별 문자열 정렬

`a < b` 는 **UTF-16 코드 번호**로 비교합니다. 사람이 기대하는 순서와 다릅니다.

```js
"apple" < "Banana"; // false  ← B(66) 가 a(97) 보다 작아서
"apple".localeCompare("Banana"); // -1     ← a 가 앞 (맞음)
```

한글은 코드 번호가 라틴 문자보다 훨씬 뒤라, 그냥 정렬하면 **한글이 전부 뒤로 밀립니다.**
`localeCompare(b, "ko")` 를 쓰면 한글을 앞에 놓습니다.

```
그냥 정렬 : AI, CS, Claude, JS, ... , 개발환경, 계층형, 디자인패턴
"ko"      : 개발환경, 계층형, 디자인패턴, ... , AI, Claude, CS, JS
```

**쓴 곳** — [tags.ts](src/lib/archive/tags.ts) 의 태그 정렬.
`||` 로 2순위 정렬을 만든 게 포인트입니다. 앞이 `0`(글 수가 같음)일 때만 뒤로 넘어갑니다.

```ts
.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "ko"));
//               1순위: 글 수 많은 순    2순위: 이름 가나다순
```

**주의 — 환경마다 결과가 다를 수 있다**

`localeCompare` 는 런타임의 **ICU**(유니코드 데이터)에 기대는데, 빌드 옵션에 따라
로케일 데이터가 빠져 있을 수 있습니다. 예전 Node 는 `small-icu` 로 빌드돼
`"ko"` 를 줘도 무시하고 영어 규칙으로 정렬하는 일이 있었습니다.

이 프로젝트는 `collectTags` 가 클라이언트 컴포넌트 안에서 돌아
**서버(SSR)와 브라우저 양쪽에서 실행**됩니다. 순서가 갈리면 하이드레이션 불일치입니다.

> 확인해 보니 지금은 문제없습니다 — Node 20+ 는 기본이 full-icu 라
> Node 정렬과 브라우저 정렬이 같고, SSR 순서와 하이드레이션 후 순서도 일치합니다.
> 다만 런타임이 바뀌면(경량 이미지, 일부 엣지 런타임) 깨질 수 있는 자리입니다.
> 확실히 막으려면 정렬을 **서버에서만** 하고 결과를 내려보내면 됩니다.

- 검색어: `Intl.Collator`, `full-icu`, `small-icu`
- https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare

### 폰트 서브셋

한글 폰트는 글자 수가 많아 통째로는 3MB 가 넘습니다.
쓸 글자 범위만 남기고(`AC00–D7A3`) 힌팅을 걷어내면 448KB 까지 줄어듭니다.

- 검색어: `pyftsubset`, `fonttools`, `woff2`

### 오디오 기초 용어

- **dBFS** — 0 이 최대, 음수로 갈수록 작음. `-27dBFS` 는 거의 안 들리는 수준
- **정규화(normalize)** — 최대 진폭을 목표치까지 끌어올리기
- **디코더 프라이밍** — AAC 같은 압축 포맷이 앞에 붙이는 몇십 ms 의 여백.
  짧은 효과음에서는 이게 지연으로 느껴져 WAV 를 쓰기도 함
