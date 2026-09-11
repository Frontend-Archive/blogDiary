import { useMemo, useState } from "react";

import type { TagCount } from "@/lib/archive/tags";
import { isFilled } from "@/lib/archive/types";
import type { Archive } from "@/lib/archive/types";
import { splitDate } from "@/lib/date";
import { siteConfig } from "@/lib/site";

/** 책의 첫 면 = 표지 겸 목차 */
export function ContentsPage({
  archives,
  onOpen,
  tags,
  activeTags,
  onToggleTag,
  onClearTags,
}: {
  /** 태그로 걸러낸 뒤의 회차 목록 */
  archives: Archive[];
  /** 책 안에서는 넘김 효과로, 밖에서는 그냥 링크로 동작하도록 선택적으로 받는다 */
  onOpen?: (index: number) => void;
  tags: TagCount[];
  activeTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
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
          <ContentsTags
            tags={tags}
            activeTags={activeTags}
            onToggle={onToggleTag}
            onClear={onClearTags}
          />

          <h2 className="text-ribbon mb-4 text-2xl leading-none">목차</h2>

          {archives.length === 0 ? (
            <p className="text-ink-muted py-8 text-lg">
              {activeTags.length > 0
                ? "고른 태그의 글이 없습니다."
                : "아직 기록된 회차가 없습니다."}
            </p>
          ) : (
            <ol className="space-y-1">
              {archives.map((archive, index) => (
                <ContentsRow
                  key={archive.id}
                  archive={archive}
                  onOpen={onOpen ? () => onOpen(index + 1) : undefined}
                  filtered={activeTags.length > 0}
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
  filtered,
}: {
  archive: Archive;
  onOpen?: () => void;
  /** 태그로 걸러낸 목록인지. 걸러냈다면 '몇 칸 중 몇 편'이 뜻을 잃는다. */
  filtered: boolean;
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
          {filtered ? `${filled}편` : `${filled}/${archive.articles.length}`}
        </span>
      </a>
    </li>
  );
}

/**
 * 목차 면 위쪽의 태그 구역. 누르면 아래 목차가 그 태그의 회차만 남는다.
 *
 * 접었을 때는 칩을 한 줄만 남긴다. 좁은 화면에서 태그가 몇 줄 깔리면 목차가 밀려 내려간다.
 * 몇 개까지 보일지는 태그 이름 길이에 달려 있어 개수로 못 자른다. 그래서 높이로 자른다.
 */
function ContentsTags({
  tags,
  activeTags,
  onToggle,
  onClear,
}: {
  tags: TagCount[];
  activeTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  // 고른 태그를 앞으로 끌어온다. 접혀 있어도 한 줄 안에 먼저 들어오도록.
  const ordered = useMemo(() => {
    if (activeTags.length === 0) return tags;
    return [
      ...tags.filter((item) => activeTags.includes(item.tag)),
      ...tags.filter((item) => !activeTags.includes(item.tag)),
    ];
  }, [tags, activeTags]);

  if (tags.length === 0) return null;

  return (
    <section aria-label="태그" className="border-rule mb-5 border-b pb-5">
      <div className="mb-2.5 flex items-baseline gap-2">
        <h2 className="text-ribbon text-2xl leading-none">태그</h2>
        <span className="text-ink-muted text-base leading-none tabular-nums">
          {tags.length}
        </span>

        {/* 글자만 있는 버튼이라 -my 로 눌리는 범위를 넓혀 둔다 */}
        <div className="ml-auto flex items-baseline gap-3">
          {activeTags.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="text-ink-muted -my-1.5 py-1.5 text-lg leading-none underline underline-offset-4"
            >
              모두 해제
            </button>
          ) : null}

          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className="text-ink-soft -my-1.5 flex items-center gap-1 py-1.5 text-lg leading-none"
          >
            {expanded ? "접기" : "모두 보기"}
            <ChevronDownIcon
              className={`size-3.5 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* 칩 높이가 min-h-10 이라 max-h-10 이면 딱 한 줄만 남는다 */}
      <ul
        className={`flex flex-wrap gap-1.5 ${
          expanded ? "" : "max-h-10 overflow-hidden"
        }`}
      >
        {ordered.map(({ tag, count }) => {
          const active = activeTags.includes(tag);
          return (
            <li key={tag}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(tag)}
                className={`flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-lg leading-none whitespace-nowrap ${
                  active
                    ? "border-ribbon bg-ribbon/10 text-ribbon"
                    : "border-rule text-ink-soft"
                }`}
              >
                <span>#{tag}</span>
                <span
                  className={`text-sm tabular-nums ${
                    active ? "text-ribbon/70" : "text-ink-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
