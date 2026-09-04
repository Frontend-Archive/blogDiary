import { entries } from "@/data/entries";
import type { DiaryEntry } from "@/types/diary";

/** 최신 날짜가 위로 오도록 정렬된 지면 목록 */
export function getEntries(): DiaryEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

export interface MonthGroup {
  /** YYYY-MM */
  month: string;
  entries: DiaryEntry[];
}

/** 책갈피 목차용: 월 단위로 묶은 지면 목록 */
export function groupByMonth(list: DiaryEntry[]): MonthGroup[] {
  const groups = new Map<string, DiaryEntry[]>();

  for (const entry of list) {
    const month = entry.date.slice(0, 7);
    const bucket = groups.get(month);
    if (bucket) {
      bucket.push(entry);
    } else {
      groups.set(month, [entry]);
    }
  }

  return [...groups.entries()].map(([month, monthEntries]) => ({
    month,
    entries: monthEntries,
  }));
}

export function countPosts(list: DiaryEntry[]): number {
  return list.reduce((total, entry) => total + entry.posts.length, 0);
}
