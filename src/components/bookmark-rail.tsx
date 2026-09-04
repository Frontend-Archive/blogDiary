"use client";

import { useEffect, useState } from "react";

import { formatMonthLabel, splitDate } from "@/lib/date";

export interface BookmarkMonth {
  month: string;
  days: { date: string; count: number }[];
}

interface BookmarkRailProps {
  months: BookmarkMonth[];
}

/** 지면(날짜) 사이를 오가는 책갈피 목차 */
export function BookmarkRail({ months }: BookmarkRailProps) {
  const dates = months.flatMap((m) => m.days.map((d) => d.date));
  const activeDate = useActiveDate(dates);

  return (
    <nav aria-label="책갈피" className="lg:sticky lg:top-24">
      <h2 className="text-ink-muted mb-4 hidden text-xs tracking-[0.08em] lg:block">
        책갈피
      </h2>

      {/* 모바일: 가로로 넘겨보는 책갈피 띠 */}
      <ul className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 lg:hidden">
        {months.flatMap((month) =>
          month.days.map((day) => (
            <li key={day.date} className="snap-start">
              <BookmarkTab
                date={day.date}
                count={day.count}
                active={day.date === activeDate}
                compact
              />
            </li>
          )),
        )}
      </ul>

      {/* 데스크톱: 세로 목차 */}
      <div className="hidden lg:block">
        {months.map((month) => (
          <div key={month.month} className="mb-6 last:mb-0">
            <p className="text-ink-muted mb-2 font-serif text-sm">
              {formatMonthLabel(month.month)}
            </p>
            <ul className="border-rule space-y-1 border-l">
              {month.days.map((day) => (
                <li key={day.date}>
                  <BookmarkTab
                    date={day.date}
                    count={day.count}
                    active={day.date === activeDate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

interface BookmarkTabProps {
  date: string;
  count: number;
  active: boolean;
  compact?: boolean;
}

function BookmarkTab({ date, count, active, compact }: BookmarkTabProps) {
  const { month, day, weekday } = splitDate(date);

  if (compact) {
    return (
      <a
        href={`#date-${date}`}
        aria-current={active ? "true" : undefined}
        className={`border-rule bg-paper-edge flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
          active ? "border-ribbon text-ribbon" : "text-ink-soft hover:text-ink"
        }`}
      >
        <span className="font-serif">
          {Number(month)}.{day}
        </span>
        <span className="text-ink-muted text-xs">
          {weekday} · {count}
        </span>
      </a>
    );
  }

  return (
    <a
      href={`#date-${date}`}
      aria-current={active ? "true" : undefined}
      className={`group -ml-px flex items-baseline gap-2 border-l-2 py-1.5 pl-3 transition-colors ${
        active
          ? "border-ribbon text-ribbon"
          : "text-ink-soft hover:border-rule-strong hover:text-ink border-transparent"
      }`}
    >
      <span className="font-serif text-base tabular-nums">
        {Number(month)}.{day}
      </span>
      <span className="text-ink-muted text-xs">({weekday})</span>
      <span className="text-ink-muted ml-auto text-xs tabular-nums">
        {count}
      </span>
    </a>
  );
}

/** 화면에 보이는 지면 중 가장 위쪽 날짜를 추적 */
function useActiveDate(dates: string[]) {
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const key = dates.join(",");

  useEffect(() => {
    const ids = key ? key.split(",") : [];
    const sections = ids
      .map((date) => document.getElementById(`date-${date}`))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          const date = record.target.id.replace("date-", "");
          if (record.isIntersecting) {
            visible.add(date);
          } else {
            visible.delete(date);
          }
        }

        const topmost = ids.find((date) => visible.has(date));
        if (topmost) setActiveDate(topmost);
      },
      { rootMargin: "-88px 0px -60% 0px" },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [key]);

  return activeDate;
}
