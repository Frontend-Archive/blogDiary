export const siteConfig = {
  name: "blogDiary",
  title: "blogDiary",
  tagline: "흩어진 블로그 글을, 날짜별 다이어리로",
  description:
    "여러 블로그의 글을 날짜별로 모아 다이어리처럼 넘겨보는 아카이브.",
  url: "https://example.com",
} as const;

export type SiteConfig = typeof siteConfig;
