import { PostEntry } from "@/components/post-entry";
import { formatFullDate, splitDate } from "@/lib/date";
import type { DiaryEntry } from "@/types/diary";

/** 다이어리의 한 면 = 하루치 글 모음 */
export function DiaryDay({ entry }: { entry: DiaryEntry }) {
  const { year, month, day, weekday } = splitDate(entry.date);

  return (
    <section
      id={`date-${entry.date}`}
      aria-label={formatFullDate(entry.date)}
      className="border-rule bg-paper-edge/60 paper-grain ruled relative rounded-lg border px-5 py-6 shadow-[0_1px_0_var(--paper-shadow)] sm:px-8 sm:py-7"
    >
      {/* 지면 왼쪽 여백선 */}
      <span
        aria-hidden="true"
        className="bg-ribbon-soft/30 absolute inset-y-6 left-3 hidden w-px sm:block"
      />

      <header className="border-rule mb-5 flex items-baseline gap-3 border-b pb-3">
        <span className="text-ink font-serif text-3xl leading-none tabular-nums">
          {day}
        </span>
        <span className="text-ink-soft font-serif text-sm">
          {year}.{month}
        </span>
        <span className="text-ribbon text-sm">{weekday}</span>
        <span className="text-ink-muted ml-auto text-xs">
          글 {entry.posts.length}
        </span>
      </header>

      <ul className="divide-rule/60 divide-y">
        {entry.posts.map((post) => (
          <PostEntry key={post.id} post={post} />
        ))}
      </ul>
    </section>
  );
}
