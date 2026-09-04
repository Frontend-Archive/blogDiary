import { BookmarkRail } from "@/components/bookmark-rail";
import { DiaryDay } from "@/components/diary-day";
import { formatShortDate } from "@/lib/date";
import { countPosts, getEntries, groupByMonth } from "@/lib/entries";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const entries = getEntries();
  const months = groupByMonth(entries).map((group) => ({
    month: group.month,
    days: group.entries.map((entry) => ({
      date: entry.date,
      count: entry.posts.length,
    })),
  }));

  const latest = entries.at(0);
  const oldest = entries.at(-1);

  return (
    <div className="space-y-10">
      {/* 표지 */}
      <section className="border-rule border-b pb-8">
        <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
          {siteConfig.tagline}
        </h1>
        <p className="text-ink-soft mt-3 max-w-xl leading-7">
          {siteConfig.description}
        </p>
        <p className="text-ink-muted mt-4 text-xs">
          {entries.length}개의 지면 · 글 {countPosts(entries)}편
          {latest && oldest ? (
            <>
              {" · "}
              {formatShortDate(oldest.date)} — {formatShortDate(latest.date)}
            </>
          ) : null}
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <aside className="min-w-0 lg:order-none">
          <BookmarkRail months={months} />
        </aside>

        <div className="min-w-0 space-y-8">
          {entries.map((entry) => (
            <DiaryDay key={entry.date} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}
