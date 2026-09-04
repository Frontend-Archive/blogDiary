const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** "2026-09-04" -> Date (로컬 타임존 오차 없이 파싱) */
export function parseDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** "2026-09-04" -> { year: "2026", month: "09", day: "04", weekday: "금" } */
export function splitDate(date: string) {
  const d = parseDate(date);
  return {
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, "0"),
    day: String(d.getDate()).padStart(2, "0"),
    weekday: WEEKDAYS[d.getDay()],
  };
}

/** "2026-09-04" -> "2026년 9월 4일 금요일" */
export function formatFullDate(date: string): string {
  const d = parseDate(date);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}요일`;
}

/** "2026-09-04" -> "9.04 (금)" */
export function formatShortDate(date: string): string {
  const { month, day, weekday } = splitDate(date);
  return `${Number(month)}.${day} (${weekday})`;
}

/** "2026-09" -> "2026년 9월" */
export function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split("-");
  return `${year}년 ${Number(month)}월`;
}
