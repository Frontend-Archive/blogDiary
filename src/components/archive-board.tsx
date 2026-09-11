"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BookmarkRail } from "@/components/bookmark/bookmark-rail";
import { DiaryPage } from "@/components/diary-page";
import { TagChips } from "@/components/tag/tag-chips";
import { groupByYear } from "@/lib/archive/select";
import { collectTags, filterByTags } from "@/lib/archive/tags";
import type { Archive } from "@/lib/archive/types";

/**
 * 데스크톱 지면 목록.
 * 태그 필터가 책갈피와 지면 양쪽을 동시에 바꾸므로 둘을 한 곳에서 쥐고 그린다.
 */
export function ArchiveBoard({ archives }: { archives: Archive[] }) {
  // 고른 순서를 그대로 둔다. 태그 줄에 누른 차례대로 적힌다.
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const topRef = useRef<HTMLDivElement>(null);

  const tags = useMemo(() => collectTags(archives), [archives]);
  const visible = useMemo(
    () => filterByTags(archives, activeTags),
    [archives, activeTags],
  );
  const years = useMemo(() => groupByYear(visible), [visible]);
  const matched = useMemo(
    () => visible.reduce((sum, archive) => sum + archive.articles.length, 0),
    [visible],
  );

  // 고른 태그를 다시 누르면 그것만 뺀다.
  const toggleTag = (tag: string) =>
    setActiveTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );

  // 지면 한참 아래에서 태그를 눌렀을 때 목록이 줄면 엉뚱한 위치에 남는다.
  // 필터가 바뀌면 목록 첫머리로 올려 준다.
  //
  // '처음인가'를 플래그로 재면 안 된다. 개발 모드(StrictMode)에서는 이펙트가 두 번 도는데,
  // 두 번째에는 플래그가 이미 켜져 있어 페이지를 연 것만으로 표지를 지나쳐 버린다.
  // 직전에 처리한 값 자체를 들고 비교하면 몇 번을 돌든 결과가 같다.
  const handled = useRef(activeTags);
  useEffect(() => {
    if (handled.current === activeTags) return;
    handled.current = activeTags;
    topRef.current?.scrollIntoView({ block: "start" });
  }, [activeTags]);

  const filtered = activeTags.length > 0;

  return (
    <div ref={topRef} className="space-y-8">
      <TagChips
        tags={tags}
        activeTags={activeTags}
        matched={matched}
        onToggle={toggleTag}
        onClear={() => setActiveTags([])}
      />

      <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <aside className="min-w-0">
          <BookmarkRail years={years} filtered={filtered} />
        </aside>

        <div className="min-w-0 space-y-8">
          {visible.map((archive) => (
            <DiaryPage
              key={archive.id}
              archive={archive}
              activeTags={activeTags}
              onSelectTag={toggleTag}
            />
          ))}

          {visible.length === 0 ? (
            <p className="text-ink-muted border-rule rounded-lg border border-dashed p-8 text-center text-sm">
              아직 기록된 회차가 없습니다.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
