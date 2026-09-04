import { isFilled } from "@/lib/archive/types";
import type { Archive } from "@/lib/archive/types";
import { splitDate } from "@/lib/date";
import { siteConfig } from "@/lib/site";

/** 책의 첫 면 = 표지 겸 목차 */
export function ContentsPage({
  archives,
  onOpen,
}: {
  archives: Archive[];
  /** 책 안에서는 넘김 효과로, 밖에서는 그냥 링크로 동작하도록 선택적으로 받는다 */
  onOpen?: (index: number) => void;
}) {
  return (
    <article className="bg-paper paper-grain font-hand flex h-full flex-col">
      {/* 표지 */}
      <header className="shrink-0 pt-12 pr-14 pb-6 pl-8">
        <p className="text-ink-muted text-lg leading-none">{siteConfig.name}</p>

        <h1 className="text-ink mt-4 text-[2.1rem] leading-[1.3] tracking-tight break-keep">
          {siteConfig.tagline}
        </h1>
      </header>

      {/* 목차 */}
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        {/* 괘선과 여백선은 종이에 그려 글과 함께 스크롤된다. */}
        <div className="ruled relative min-h-full py-6 pr-5 pl-8">
          <span
            aria-hidden="true"
            className="bg-ribbon-soft/35 absolute inset-y-0 left-5 w-px"
          />
          <h2 className="text-ribbon mb-4 text-2xl leading-none">목차</h2>

          {archives.length === 0 ? (
            <p className="text-ink-muted py-8 text-lg">
              아직 기록된 회차가 없습니다.
            </p>
          ) : (
            <ol className="space-y-1">
              {archives.map((archive, index) => (
                <ContentsRow
                  key={archive.id}
                  archive={archive}
                  onOpen={onOpen ? () => onOpen(index + 1) : undefined}
                />
              ))}
            </ol>
          )}
        </div>
      </div>
    </article>
  );
}

function ContentsRow({
  archive,
  onOpen,
}: {
  archive: Archive;
  onOpen?: () => void;
}) {
  const { month, day, weekday } = splitDate(archive.date);
  const filled = archive.articles.filter(isFilled).length;

  return (
    <li>
      <a
        href={`/p/${archive.id}`}
        onClick={(event) => {
          if (!onOpen) return;
          if (event.metaKey || event.ctrlKey || event.shiftKey) return;
          event.preventDefault();
          onOpen();
        }}
        className="hover:bg-rule/30 -mx-2 flex items-baseline gap-2.5 rounded-md px-2 py-2.5 transition-colors"
      >
        <span className="text-ink w-[3.5rem] shrink-0 text-[1.35rem] leading-none tabular-nums">
          {archive.id}회차
        </span>
        <span className="text-ink-soft text-xl leading-none tabular-nums">
          {Number(month)}.{day}
        </span>
        <span className="text-ink-muted text-lg leading-none">{weekday}</span>

        {/* 목차의 점선 이음줄 */}
        <span
          aria-hidden="true"
          className="border-rule-strong/60 min-w-4 flex-1 translate-y-[-0.3rem] border-b border-dotted"
        />

        <span className="text-ink-muted shrink-0 text-lg leading-none tabular-nums">
          {filled}/{archive.articles.length}
        </span>
      </a>
    </li>
  );
}
