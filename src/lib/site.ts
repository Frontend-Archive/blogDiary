export const siteConfig = {
  name: "blogDiary",
  title: "blogDiary",
  description: "개발 기록과 일상을 남기는 블로그",
  url: "https://example.com",
  nav: [
    { href: "/", label: "홈" },
    { href: "/posts", label: "글" },
    { href: "/about", label: "소개" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
