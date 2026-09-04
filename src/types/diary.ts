/** 외부 블로그에서 수집한 글 하나 */
export interface Post {
  id: string;
  title: string;
  url: string;
  /** 요약 (없을 수 있음) */
  excerpt?: string;
  /** 출처 블로그 이름 (예: velog, 개인 블로그 이름) */
  source: string;
  author: string;
  /** ISO 8601 (예: 2026-09-04T09:12:00+09:00) */
  publishedAt: string;
  tags?: string[];
  /** 읽는 데 걸리는 시간(분) */
  readingMinutes?: number;
}

/** 하루치 지면. 다이어리의 한 '면'에 해당 */
export interface DiaryEntry {
  /** YYYY-MM-DD. 앵커 id로도 사용 */
  date: string;
  posts: Post[];
}
