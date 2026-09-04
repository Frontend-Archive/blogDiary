import type { DiaryEntry } from "@/types/diary";

/**
 * 목업 데이터. 실제 서비스에서는 RSS/Atom 수집 결과를 날짜별로 묶어
 * 동일한 형태로 내려주면 됩니다. URL은 모두 자리표시자입니다.
 */
export const entries: DiaryEntry[] = [
  {
    date: "2026-09-04",
    posts: [
      {
        id: "20260904-1",
        title: "Next.js 16으로 올리면서 정리한 것들",
        url: "https://example.com/posts/next-16-upgrade",
        excerpt:
          "Turbopack이 기본이 되면서 빌드 파이프라인에서 걷어낸 설정들과, App Router 타입 생성 방식이 바뀌며 겪은 문제를 정리했다.",
        source: "느린 빌드",
        author: "jinu",
        publishedAt: "2026-09-04T09:12:00+09:00",
        tags: ["nextjs", "빌드"],
        readingMinutes: 8,
      },
      {
        id: "20260904-2",
        title: "타입스크립트 satisfies를 3개월 써보고",
        url: "https://example.com/posts/satisfies-in-practice",
        excerpt:
          "as를 걷어내는 데는 확실히 도움이 됐지만, 모든 자리에 넣을 필요는 없었다는 이야기.",
        source: "코드 조각",
        author: "haeun",
        publishedAt: "2026-09-04T13:40:00+09:00",
        tags: ["typescript"],
        readingMinutes: 5,
      },
      {
        id: "20260904-3",
        title: "사내 디자인 시스템 v2 회고",
        url: "https://example.com/posts/design-system-v2",
        source: "TIL 노트",
        author: "sujin",
        publishedAt: "2026-09-04T21:05:00+09:00",
        tags: ["디자인시스템", "회고"],
        readingMinutes: 12,
      },
    ],
  },
  {
    date: "2026-09-02",
    posts: [
      {
        id: "20260902-1",
        title: "React 서버 컴포넌트에서의 데이터 캐싱 전략",
        url: "https://example.com/posts/rsc-caching",
        excerpt:
          "요청 단위 캐시와 영속 캐시를 구분해서 쓰기 시작하니 무효화 로직이 훨씬 단순해졌다.",
        source: "느린 빌드",
        author: "jinu",
        publishedAt: "2026-09-02T08:30:00+09:00",
        tags: ["react", "캐싱"],
        readingMinutes: 10,
      },
      {
        id: "20260902-2",
        title: "CSS 컨테이너 쿼리로 카드 컴포넌트 다시 짜기",
        url: "https://example.com/posts/container-queries",
        source: "픽셀 일지",
        author: "minseo",
        publishedAt: "2026-09-02T19:22:00+09:00",
        tags: ["css"],
        readingMinutes: 6,
      },
    ],
  },
  {
    date: "2026-08-29",
    posts: [
      {
        id: "20260829-1",
        title: "모노레포에서 빌드 캐시가 계속 깨지던 이유",
        url: "https://example.com/posts/monorepo-cache-miss",
        excerpt:
          "결국 원인은 lockfile이 아니라 환경 변수였다. 캐시 키에 무엇을 넣을지 다시 생각하게 된 사건.",
        source: "코드 조각",
        author: "haeun",
        publishedAt: "2026-08-29T11:05:00+09:00",
        tags: ["모노레포", "CI"],
        readingMinutes: 9,
      },
      {
        id: "20260829-2",
        title: "주니어 개발자에게 코드 리뷰를 남기는 법",
        url: "https://example.com/posts/code-review-notes",
        source: "TIL 노트",
        author: "sujin",
        publishedAt: "2026-08-29T15:48:00+09:00",
        tags: ["협업"],
        readingMinutes: 7,
      },
      {
        id: "20260829-3",
        title: "Playwright 테스트를 30분에서 4분으로",
        url: "https://example.com/posts/playwright-speedup",
        excerpt: "샤딩보다 먼저 손봐야 했던 것은 로그인 픽스처였다.",
        source: "픽셀 일지",
        author: "minseo",
        publishedAt: "2026-08-29T22:10:00+09:00",
        tags: ["테스트"],
        readingMinutes: 11,
      },
    ],
  },
  {
    date: "2026-08-24",
    posts: [
      {
        id: "20260824-1",
        title: "웹 폰트 없이 한글 타이포그래피 다듬기",
        url: "https://example.com/posts/korean-typography",
        excerpt:
          "시스템 폰트 스택만으로도 자간과 행간을 조절하면 읽는 맛이 꽤 달라진다.",
        source: "픽셀 일지",
        author: "minseo",
        publishedAt: "2026-08-24T10:00:00+09:00",
        tags: ["타이포그래피", "css"],
        readingMinutes: 6,
      },
    ],
  },
  {
    date: "2026-08-18",
    posts: [
      {
        id: "20260818-1",
        title: "RSS는 아직 죽지 않았다",
        url: "https://example.com/posts/rss-is-alive",
        excerpt:
          "개인 블로그를 다시 모아 읽기 시작하면서 만든 작은 수집기 이야기.",
        source: "느린 빌드",
        author: "jinu",
        publishedAt: "2026-08-18T09:00:00+09:00",
        tags: ["rss", "사이드프로젝트"],
        readingMinutes: 4,
      },
      {
        id: "20260818-2",
        title: "에러 바운더리를 어디에 둘 것인가",
        url: "https://example.com/posts/error-boundary-placement",
        source: "코드 조각",
        author: "haeun",
        publishedAt: "2026-08-18T17:35:00+09:00",
        tags: ["react"],
        readingMinutes: 8,
      },
    ],
  },
];
