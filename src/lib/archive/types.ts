/**
 * Frontend-Archive/archive 레포의 archives/YYYYMM.md 스키마.
 * 원본 정의: https://github.com/Frontend-Archive/archive#타입
 */

export type MeetingType = "on-line" | "off-line";

/** 회차에서 한 명이 발표한 아티클. 아직 안 채운 자리는 title/url/tags가 모두 비어 있다. */
export interface Article {
  author: string;
  title: string;
  url: string;
  tags: string[];
}

/** 파일 하나 = 스터디 한 회차 */
export interface Archive {
  id: number;
  /** 'YYYY-MM-DD' */
  date: string;
  title: string;
  type: MeetingType;
  articles: Article[];
  /** 파일명에서 온 'YYYYMM' */
  slug: string;
  /** frontmatter 아래 본문 한 줄 요약 */
  summary: string;
  /** 원본 파일 GitHub 링크 */
  sourceUrl: string;
}

/** 발표자 자리는 잡혀 있지만 아직 글이 없는 항목 */
export function isFilled(article: Article): boolean {
  return article.title.trim() !== "" && article.url.trim() !== "";
}
