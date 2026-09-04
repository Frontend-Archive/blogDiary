"use client";

import { BookmarkList } from "@/components/bookmark/bookmark-list";
import {
  collectDates,
  useActiveDate,
} from "@/components/bookmark/use-active-date";
import type { YearGroup } from "@/lib/archive/select";

/** 데스크톱: 지면 옆에 붙어 따라오는 세로 목차 */
export function BookmarkRail({ years }: { years: YearGroup[] }) {
  const activeDate = useActiveDate(collectDates(years));

  if (years.length === 0) return null;

  return (
    <nav aria-label="책갈피" className="sticky top-24">
      <h2 className="text-ink-muted mb-4 text-xs tracking-[0.08em]">책갈피</h2>
      <BookmarkList years={years} activeDate={activeDate} />
    </nav>
  );
}
