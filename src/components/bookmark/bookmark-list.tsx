"use client";

import type { YearGroup } from "@/lib/archive/select";
import { splitDate } from "@/lib/date";

type Session = YearGroup["sessions"][number];

/** 연도 → 회차 순으로 늘어놓은 목차. 데스크톱 레일과 모바일 시트가 함께 쓴다. */
export function BookmarkList({
  years,
  activeDate,
  onSelect,
}: {
  years: YearGroup[];
  activeDate: string | null;
  onSelect?: () => void;
}) {
  return (
    <>
      {years.map((year) => (
        <div key={year.year} className="mb-6 last:mb-0">
          <p className="text-ink-muted mb-2 font-serif text-sm">
            {year.year}년
          </p>
          <ul className="border-rule space-y-1 border-l">
            {year.sessions.map((session) => (
              <li key={session.date}>
                <BookmarkTab
                  session={session}
                  active={session.date === activeDate}
                  onSelect={onSelect}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function BookmarkTab({
  session,
  active,
  onSelect,
}: {
  session: Session;
  active: boolean;
  onSelect?: () => void;
}) {
  const { month, day, weekday } = splitDate(session.date);

  return (
    <a
      href={`#date-${session.date}`}
      aria-current={active ? "true" : undefined}
      onClick={onSelect}
      className={`-ml-px flex items-baseline gap-2 border-l-2 py-2 pl-3 transition-colors ${
        active
          ? "border-ribbon text-ribbon"
          : "hover:border-rule-strong text-ink-soft hover:text-ink border-transparent"
      }`}
    >
      <span className="font-serif text-base tabular-nums">
        {session.id}회차
      </span>
      <span className="text-ink-muted text-xs tabular-nums">
        {Number(month)}.{day} ({weekday})
      </span>
      <span className="text-ink-muted ml-auto text-xs tabular-nums">
        {session.filled}/{session.total}
      </span>
    </a>
  );
}
