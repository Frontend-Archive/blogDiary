import { formatTime } from "@/lib/date";
import type { Post } from "@/types/diary";

export function PostEntry({ post }: { post: Post }) {
  return (
    <li className="group">
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:bg-rule/25 -mx-3 flex gap-3 rounded-md px-3 py-3 transition-colors sm:gap-4"
      >
        <time
          dateTime={post.publishedAt}
          className="text-ink-muted mt-[0.2rem] shrink-0 font-mono text-xs tabular-nums"
        >
          {formatTime(post.publishedAt)}
        </time>

        <div className="min-w-0 flex-1">
          <h3 className="text-ink decoration-ribbon-soft leading-7 font-medium underline-offset-4 group-hover:underline">
            {post.title}
            <ArrowIcon className="text-ink-muted group-hover:text-ribbon ml-1.5 inline size-3.5 align-baseline transition-colors" />
          </h3>

          {post.excerpt ? (
            <p className="text-ink-soft mt-1 line-clamp-2 text-sm leading-7">
              {post.excerpt}
            </p>
          ) : null}

          <p className="text-ink-muted mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="text-ink-soft">{post.source}</span>
            <span aria-hidden="true">·</span>
            <span>{post.author}</span>
            {post.readingMinutes ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.readingMinutes}분</span>
              </>
            ) : null}
            {post.tags?.length ? (
              <span className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-rule rounded-sm border px-1.5 py-px"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            ) : null}
          </p>
        </div>
      </a>
    </li>
  );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
