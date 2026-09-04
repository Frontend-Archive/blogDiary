"use client";

import { useEffect, useState } from "react";

/** 헤더 아래 이 선을 지나간 지면을 '읽고 있는 지면'으로 본다. */
const ACTIVE_LINE = 120;

/**
 * 지금 읽고 있는 지면의 날짜를 추적한다.
 * 기준선을 지나간 지면 중 마지막 것 = 화면 상단을 차지하고 있는 지면.
 */
export function useActiveDate(dates: string[]): string | null {
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const key = dates.join(",");

  useEffect(() => {
    const ids = key ? key.split(",") : [];
    const sections = ids
      .map((date) => document.getElementById(`date-${date}`))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top > ACTIVE_LINE) break;
        current = section;
      }
      setActiveDate(current.id.replace("date-", ""));
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key]);

  return activeDate;
}

export function collectDates(
  years: { sessions: { date: string }[] }[],
): string[] {
  return years.flatMap((year) => year.sessions.map((session) => session.date));
}
