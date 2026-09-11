import { isFilled } from "@/lib/archive/types";
import type { Archive } from "@/lib/archive/types";

export interface TagCount {
  tag: string;
  /** 이 태그가 붙은 글 수 */
  count: number;
}

/** 글이 올라온 항목의 태그만 모아 많이 쓰인 순으로 늘어놓는다. */
export function collectTags(archives: Archive[]): TagCount[] {
  const counts = new Map<string, number>();

  for (const archive of archives) {
    for (const article of archive.articles) {
      if (!isFilled(article)) continue;
      // 한 글에 같은 태그가 두 번 적혀 있어도 한 번만 센다.
      for (const tag of new Set(article.tags)) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "ko"));
}

/**
 * 고른 태그로 걸러낸 회차 목록.
 * 회차 안에서도 걸린 글만 남기고, 남은 글이 없는 회차는 통째로 뺀다.
 * 고른 게 없으면(= 필터를 걸지 않으면) 원본을 그대로 돌려준다.
 *
 * 여러 개를 고르면 '그중 하나라도 붙은 글'(합집합)을 남긴다.
 * 태그 대부분이 글 한 편에만 붙어 있어 교집합으로 잡으면 거의 항상 빈 목록이 된다.
 */
export function filterByTags(archives: Archive[], tags: string[]): Archive[] {
  if (tags.length === 0) return archives;

  const wanted = new Set(tags);

  return archives
    .map((archive) => ({
      ...archive,
      articles: archive.articles.filter(
        (article) =>
          isFilled(article) && article.tags.some((tag) => wanted.has(tag)),
      ),
    }))
    .filter((archive) => archive.articles.length > 0);
}
