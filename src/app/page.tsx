import { BookReader } from "@/components/book/book-reader";
import { BookmarkRail } from "@/components/bookmark/bookmark-rail";
import { DiaryPage } from "@/components/diary-page";
import { groupByYear, summarize } from "@/lib/archive/select";
import { loadArchives } from "@/lib/archive/load";
import { formatShortDate } from "@/lib/date";
import { siteConfig } from "@/lib/site";

// Next의 세그먼트 설정은 정적으로 분석되므로 리터럴이어야 한다.
// (lib/archive/config.ts의 REVALIDATE_SECONDS와 같은 값)
export const revalidate = 3600;

export default async function Home() {
  const { archives, failures, error } = await loadArchives();
  const stats = summarize(archives);
  const years = groupByYear(archives);

  return (
    <>
      {/* 모바일: 책의 첫 면(목차). 여기서부터 한 장씩 넘겨 읽는다. */}
      <div className="lg:hidden">
        <BookReader archives={archives} initialIndex={0} />
      </div>

      {/* 데스크톱: 지면을 한 화면에 펼쳐 두고 스크롤 */}
      <div className="hidden space-y-10 lg:block">
        <section className="border-rule border-b pb-8">
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            {siteConfig.tagline}
          </h1>
          <p className="text-ink-soft mt-3 max-w-xl leading-7">
            {siteConfig.description}
          </p>
          <p className="text-ink-muted mt-4 text-xs">
            {stats.sessions}회차 · 글 {stats.filled}편 / {stats.slots}칸
            {stats.from && stats.to ? (
              <>
                {" · "}
                {formatShortDate(stats.from)} — {formatShortDate(stats.to)}
              </>
            ) : null}
          </p>
        </section>

        {error ? <Notice>{error}</Notice> : null}
        {failures.length ? (
          <Notice>
            {failures.length}개 회차를 읽지 못했습니다:{" "}
            {failures.map((failure) => failure.file).join(", ")}
          </Notice>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <aside className="min-w-0">
            <BookmarkRail years={years} />
          </aside>

          <div className="min-w-0 space-y-8">
            {archives.map((archive) => (
              <DiaryPage key={archive.id} archive={archive} />
            ))}

            {archives.length === 0 && !error ? (
              <p className="text-ink-muted border-rule rounded-lg border border-dashed p-8 text-center text-sm">
                아직 기록된 회차가 없습니다.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-ribbon-soft/50 text-ink-soft rounded-md border border-dashed px-4 py-3 text-sm">
      {children}
    </p>
  );
}
