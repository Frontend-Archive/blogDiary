"use client";

import type { Article } from "@/lib/archive/types";

/** 글이 올라온 항목만 그린다. 미작성 자리는 지면 아래에 이름만 모아 둔다. */
export function ArticleEntry({
  article,
  activeTags,
  onSelectTag,
}: {
  article: Article;
  activeTags: string[];
  onSelectTag: (tag: string) => void;
}) {
  return (
    <li className="py-3">
      <p className="leading-7 break-keep">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink decoration-ribbon-soft font-medium underline-offset-4 hover:underline"
        >
          {article.title}
        </a>
        <span className="text-ink-muted text-xs whitespace-nowrap">
          <span aria-hidden="true" className="text-ink-muted/55 mx-1">
            –
          </span>
          {article.author}
        </span>
      </p>

      {article.tags.length > 0 ? (
        // 모바일 지면과 같은 형광펜(.marker) 자국. 누르면 그 태그로 걸러진다.
        <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs leading-none">
          {article.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={activeTags.includes(tag)}
              onClick={() => onSelectTag(tag)}
              className={`marker rounded-xs transition-colors ${
                activeTags.includes(tag)
                  ? "text-ribbon"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              #{tag}
            </button>
          ))}
        </p>
      ) : null}
    </li>
  );
}
