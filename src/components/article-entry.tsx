import type { Article } from "@/lib/archive/types";

/** 글이 올라온 항목만 그린다. 미작성 자리는 지면 아래에 이름만 모아 둔다. */
export function ArticleEntry({ article }: { article: Article }) {
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

      <p className="text-ink-muted mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        {article.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </p>
    </li>
  );
}
