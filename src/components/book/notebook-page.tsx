import { isFilled } from "@/lib/archive/types";
import type { Archive, Article } from "@/lib/archive/types";
import { formatFullDate, splitDate } from "@/lib/date";

/** 공책 한 면 = 스터디 한 회차 */
export function NotebookPage({ archive }: { archive: Archive }) {
  const { year, month, day, weekday } = splitDate(archive.date);
  const written = archive.articles.filter(isFilled);
  const missing = archive.articles
    .filter((article) => !isFilled(article))
    .map((article) => article.author)
    .filter(Boolean);

  return (
    <article
      className="bg-paper paper-grain font-hand flex h-full flex-col"
      aria-label={`${archive.title} · ${formatFullDate(archive.date)}`}
    >
      {/* 지면 머리: 회차가 제목, 그 아래 날짜 */}
      <header className="border-rule shrink-0 border-b pt-9 pr-5 pb-5 pl-8">
        {/* 제목을 누르면 원본 md(?plain=1)로 간다 */}
        <h2 className="pr-12 text-[2.5rem] leading-none tracking-tight">
          <a
            href={archive.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="원문 보기"
            className="text-ink decoration-ribbon-soft underline-offset-[6px] hover:underline"
          >
            {archive.title}
          </a>
        </h2>

        <p className="text-ink-soft flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xl leading-none">
          <span>
            {year}년 {Number(month)}월 {Number(day)}일
          </span>
          <span className="text-ribbon">{weekday}요일</span>
          <span className="text-ink-muted" aria-hidden="true">
            ·
          </span>
          <span className="text-ink-muted text-lg">
            {archive.type === "on-line" ? "온라인" : "오프라인"}
          </span>
        </p>
      </header>

      {/* 지면 본문: 괘선 위에 적힌 글 */}
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        {/*
         * 괘선과 여백선은 스크롤되는 바깥이 아니라 '종이' 자체에 그린다.
         * 그래야 글과 함께 밀려 올라간다. min-h-full 은 글이 짧아도 지면을 채우기 위한 것.
         */}
        <div className="ruled relative min-h-full py-6 pr-5 pl-8">
          <span
            aria-hidden="true"
            className="bg-ribbon-soft/35 absolute inset-y-0 left-5 w-px"
          />
          {written.length > 0 ? (
            <ul className="space-y-6">
              {written.map((article, index) => (
                <NotebookLine
                  key={`${archive.id}-${article.author || index}`}
                  article={article}
                />
              ))}
            </ul>
          ) : (
            <p className="text-ink-muted/75 text-xl leading-snug">
              아직 올라온 글이 없습니다
            </p>
          )}

          {missing.length > 0 ? (
            <div className="border-rule mt-8 border-t pt-4">
              <p className="text-ink-muted text-base leading-none">
                참여 안한 사람
              </p>
              <p className="text-ink-soft mt-2 text-lg leading-snug">
                {missing.join(", ")}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** 글이 올라온 항목만 그린다. 미작성 자리는 지면 아래에 이름만 모아 둔다. */
function NotebookLine({ article }: { article: Article }) {
  return (
    <li>
      {/* 제목 뒤에 이름을 붙여 적는다. 줄이 모자라면 이름만 다음 줄로 넘어간다. */}
      <p className="text-[1.4rem] leading-8 break-keep">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink decoration-ribbon-soft underline-offset-4 hover:underline"
        >
          {article.title}
        </a>
        <span className="text-ink-muted text-[1.05rem] whitespace-nowrap">
          <span aria-hidden="true" className="text-ink-muted/55 mx-1">
            –
          </span>
          {article.author}
        </span>
      </p>

      {article.tags.length > 0 ? (
        <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-base leading-none">
          {article.tags.map((tag) => (
            <span key={tag} className="marker text-ink-muted">
              #{tag}
            </span>
          ))}
        </p>
      ) : null}
    </li>
  );
}
