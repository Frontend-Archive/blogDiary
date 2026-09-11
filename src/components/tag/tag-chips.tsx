"use client";

import { Fragment, useMemo, useState } from "react";

import type { TagCount } from "@/lib/archive/tags";

/**
 * 처음에 펼쳐 두는 칩 수.
 * 회차가 쌓이면 태그는 계속 늘어나는데, 그대로 두면 지면 위를 태그가 다 덮는다.
 * 많이 쓰인 순으로 정렬돼 있으니 앞쪽만 보여도 쓸모가 크게 줄지 않는다.
 */
const VISIBLE_CHIPS = 24;

/**
 * 지면 위에 늘어놓는 태그 칩.
 * 누르면 그 태그의 글만 남고 다시 누르면 풀린다. 여러 개를 골라 합쳐 볼 수 있다.
 */
export function TagChips({
  tags,
  activeTags,
  matched,
  onToggle,
  onClear,
}: {
  tags: TagCount[];
  /** 고른 순서대로 담긴 태그 */
  activeTags: string[];
  /** 지금 걸린 필터에 남은 글 수 */
  matched: number;
  onToggle: (tag: string) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  // 접힌 상태에서 고른 태그가 뒤쪽에 있으면 그것만 끌어와 함께 보여 준다.
  const shown = useMemo(() => {
    if (expanded || tags.length <= VISIBLE_CHIPS) return tags;

    const head = tags.slice(0, VISIBLE_CHIPS);
    const tail = tags
      .slice(VISIBLE_CHIPS)
      .filter((item) => activeTags.includes(item.tag));
    return [...head, ...tail];
  }, [expanded, tags, activeTags]);

  if (tags.length === 0) return null;

  return (
    <section
      aria-label="태그"
      className="border-rule rounded-lg border border-dashed px-4 py-3.5"
    >
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-ink-muted text-xs tracking-[0.08em]">태그</h2>

        {activeTags.length > 0 ? (
          <>
            <p className="text-ink-soft text-xs">
              {activeTags.map((tag, index) => (
                <Fragment key={tag}>
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-ink-muted/60 mx-1">
                      ·
                    </span>
                  ) : null}
                  <span className="text-ribbon">#{tag}</span>
                </Fragment>
              ))}
              <span className="ml-1.5">글 {matched}편</span>
            </p>
            <button
              type="button"
              onClick={onClear}
              className="text-ink-muted hover:text-ink ml-auto text-xs underline-offset-4 transition-colors hover:underline"
            >
              전체 보기
            </button>
          </>
        ) : (
          <p className="text-ink-muted text-xs">
            눌러서 그 태그의 글만 모아 봅니다 · 여러 개를 고르면 합쳐서 보여
            줍니다
          </p>
        )}
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {shown.map(({ tag, count }) => (
          <li key={tag}>
            <TagChip
              tag={tag}
              count={count}
              active={activeTags.includes(tag)}
              onToggle={onToggle}
            />
          </li>
        ))}

        {tags.length > shown.length || expanded ? (
          <li>
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="border-rule text-ink-muted hover:border-rule-strong hover:text-ink rounded-full border border-dashed px-2.5 py-1 text-xs whitespace-nowrap transition-colors"
            >
              {expanded ? "접기" : `+${tags.length - shown.length}개 더`}
            </button>
          </li>
        ) : null}
      </ul>
    </section>
  );
}

function TagChip({
  tag,
  count,
  active,
  onToggle,
}: {
  tag: string;
  count: number;
  active: boolean;
  onToggle: (tag: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onToggle(tag)}
      className={`flex items-baseline gap-1.5 rounded-full border px-2.5 py-1 text-xs whitespace-nowrap transition-colors ${
        active
          ? "border-ribbon bg-ribbon/10 text-ribbon"
          : "border-rule text-ink-soft hover:border-rule-strong hover:text-ink"
      }`}
    >
      <span>#{tag}</span>
      <span
        className={`text-[0.65rem] tabular-nums ${
          active ? "text-ribbon/70" : "text-ink-muted"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
