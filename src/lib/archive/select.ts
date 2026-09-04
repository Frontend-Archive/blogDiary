import { isFilled } from "@/lib/archive/types";
import type { Archive } from "@/lib/archive/types";

export interface SessionSummary {
  id: number;
  date: string;
  filled: number;
  total: number;
}

export interface YearGroup {
  year: string;
  sessions: SessionSummary[];
}

export function toSummary(archive: Archive): SessionSummary {
  return {
    id: archive.id,
    date: archive.date,
    filled: archive.articles.filter(isFilled).length,
    total: archive.articles.length,
  };
}

/** 책갈피 목차용: 연도로 묶은 회차 목록 */
export function groupByYear(archives: Archive[]): YearGroup[] {
  const groups = new Map<string, SessionSummary[]>();

  for (const archive of archives) {
    const year = archive.date.slice(0, 4);
    const bucket = groups.get(year);
    const summary = toSummary(archive);
    if (bucket) bucket.push(summary);
    else groups.set(year, [summary]);
  }

  return [...groups.entries()].map(([year, sessions]) => ({ year, sessions }));
}

export interface ArchiveStats {
  sessions: number;
  filled: number;
  slots: number;
  authors: string[];
  /** 가장 오래된 / 최신 회차 날짜 */
  from?: string;
  to?: string;
}

export function summarize(archives: Archive[]): ArchiveStats {
  const dates = archives.map((a) => a.date).sort();
  const articles = archives.flatMap((a) => a.articles);

  return {
    sessions: archives.length,
    filled: articles.filter(isFilled).length,
    slots: articles.length,
    authors: [...new Set(articles.map((a) => a.author).filter(Boolean))],
    from: dates.at(0),
    to: dates.at(-1),
  };
}
