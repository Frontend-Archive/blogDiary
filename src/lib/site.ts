export const siteConfig = {
  name: "blogDiary",
  title: "blogDiary",
  tagline: "스터디에서 나눈 글을, 회차별 다이어리로",
  description:
    "Frontend-Archive 스터디의 회차별 발표 아티클을 날짜순으로 모아 다이어리처럼 넘겨봅니다.",
  url: "https://example.com",
  repoUrl: "https://github.com/Frontend-Archive/archive",
} as const;

export type SiteConfig = typeof siteConfig;
