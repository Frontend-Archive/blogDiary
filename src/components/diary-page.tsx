import { ArticleEntry } from "@/components/article-entry";
import { isFilled } from "@/lib/archive/types";
import type { Archive } from "@/lib/archive/types";
import { formatFullDate, splitDate } from "@/lib/date";

/** 다이어리의 한 면 = 스터디 한 회차 */
export function DiaryPage({ archive }: { archive: Archive }) {
  const { year, month, day, weekday } = splitDate(archive.date);
  const written = archive.articles.filter(isFilled);
  const missing = archive.articles
    .filter((article) => !isFilled(article))
    .map((article) => article.author)
    .filter(Boolean);

  return (
    <section
      id={`date-${archive.date}`}
      aria-label={`${archive.title} · ${formatFullDate(archive.date)}`}
      className="border-rule bg-paper-edge/60 paper-grain ruled relative rounded-lg border px-5 py-6 shadow-[0_1px_0_var(--paper-shadow)] sm:px-8 sm:py-7"
    >
      {/* 지면 왼쪽 여백선 */}
      <span
        aria-hidden="true"
        className="bg-ribbon-soft/30 absolute inset-y-6 left-3 hidden w-px sm:block"
      />

      <header className="border-rule mb-5 border-b pb-3">
        <div className="flex items-baseline gap-3">
          <span className="text-ink font-serif text-3xl leading-none tabular-nums">
            {day}
          </span>
          <span className="text-ink-soft font-serif text-sm">
            {year}.{month}
          </span>
          <span className="text-ribbon text-sm">{weekday}</span>
          <span className="text-ink-muted ml-auto text-xs tabular-nums">
            {written.length}/{archive.articles.length}
          </span>
        </div>

        <div className="text-ink-muted mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="text-ink-soft">{archive.title}</span>
          <span aria-hidden="true">·</span>
          <span>{archive.type === "on-line" ? "온라인" : "오프라인"}</span>
          <a
            href={archive.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ribbon ml-auto underline-offset-4 hover:underline"
          >
            원문
          </a>
        </div>
      </header>

      {written.length > 0 ? (
        <ul className="divide-rule/60 divide-y">
          {written.map((article, index) => (
            <ArticleEntry
              key={`${archive.id}-${article.author || index}`}
              article={article}
            />
          ))}
        </ul>
      ) : (
        <p className="text-ink-muted py-3 text-sm">아직 올라온 글이 없습니다</p>
      )}

      {missing.length > 0 ? (
        <div className="border-rule mt-5 border-t pt-4">
          <p className="text-ink-muted text-xs">참여 안한 사람</p>
          <p className="text-ink-soft mt-1.5 text-sm">{missing.join(", ")}</p>
        </div>
      ) : null}
    </section>
  );
}
