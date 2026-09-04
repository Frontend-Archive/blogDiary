"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ContentsPage } from "@/components/book/contents-page";
import { NotebookPage } from "@/components/book/notebook-page";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Archive } from "@/lib/archive/types";

const FLIP_MS = 700;

interface FlipState {
  from: number;
  to: number;
  /** 1이면 다음 장, -1이면 앞 장 */
  dir: 1 | -1;
}

/**
 * 목차(0면)와 회차별 지면(1..n면)을 한 권의 책처럼 넘겨 읽는 뷰어.
 * 넘김은 화면 안에서 처리하고 주소만 history로 맞춰, 넘기는 동안 화면이 끊기지 않게 한다.
 */
export function BookReader({
  archives,
  initialIndex,
}: {
  archives: Archive[];
  initialIndex: number;
}) {
  const lastIndex = archives.length;
  const [current, setCurrent] = useState(clamp(initialIndex, lastIndex));
  const [flip, setFlip] = useState<FlipState | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const hrefFor = useCallback(
    (index: number) => (index === 0 ? "/" : `/p/${archives[index - 1].id}`),
    [archives],
  );

  const goTo = useCallback(
    (target: number) => {
      const next = clamp(target, lastIndex);
      if (flip || next === current) return;

      const dir: 1 | -1 = next > current ? 1 : -1;
      window.history.pushState(null, "", hrefFor(next));

      if (prefersReducedMotion()) {
        setCurrent(next);
        return;
      }
      setFlip({ from: current, to: next, dir });
    },
    [current, flip, hrefFor, lastIndex],
  );

  const finishFlip = useCallback(() => {
    setFlip((state) => {
      if (state) setCurrent(state.to);
      return null;
    });
  }, []);

  // 애니메이션이 끝나지 않는 경우(탭 전환 등)를 대비한 안전장치
  useEffect(() => {
    if (!flip) return;
    const timer = window.setTimeout(finishFlip, FLIP_MS + 120);
    return () => window.clearTimeout(timer);
  }, [flip, finishFlip]);

  // 뒤로/앞으로 가기
  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(/^\/p\/(\d+)/);
      const id = match ? Number(match[1]) : null;
      const index =
        id === null ? 0 : archives.findIndex((a) => a.id === id) + 1 || 0;
      setFlip(null);
      setCurrent(clamp(index, lastIndex));
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [archives, lastIndex]);

  // 키보드 좌우
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "ArrowRight") goTo(current + 1);
      if (event.key === "ArrowLeft") goTo(current - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, goTo]);

  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    // 세로 스크롤과 헷갈리지 않도록 가로 이동이 확실할 때만
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    goTo(dx < 0 ? current + 1 : current - 1);
  };

  const renderPage = (index: number) =>
    index === 0 ? (
      <ContentsPage archives={archives} onOpen={goTo} />
    ) : (
      <NotebookPage archive={archives[index - 1]} />
    );

  const bottomIndex = flip ? (flip.dir === 1 ? flip.to : flip.from) : current;
  const leafIndex = flip ? (flip.dir === 1 ? flip.from : flip.to) : current;

  return (
    <div
      data-book-fullscreen
      className="bg-paper fixed inset-0 z-30 flex flex-col overflow-hidden lg:relative lg:inset-auto lg:z-auto lg:mx-auto lg:h-[80vh] lg:max-w-2xl lg:overflow-hidden lg:rounded-xl lg:border lg:border-[var(--rule)] lg:shadow-xl lg:shadow-black/10"
    >
      {/* 지면과 함께 넘어가지 않도록 책 바깥에 둔다 */}
      <div className="absolute top-3 right-4 z-10">
        <ThemeToggle />
      </div>

      <div
        ref={stageRef}
        className="book-stage min-h-0 flex-1"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={
            flip
              ? `book-sheet ${flip.dir === 1 ? "book-sheet-forward" : "book-sheet-backward"}`
              : "book-sheet"
          }
        >
          {renderPage(bottomIndex)}
          {flip ? <div className="book-shadow" /> : null}
        </div>

        {flip ? (
          <div
            className={
              flip.dir === 1
                ? "book-leaf book-leaf-forward"
                : "book-leaf book-leaf-backward"
            }
            onAnimationEnd={finishFlip}
            aria-hidden="true"
          >
            <div className="book-face">
              {renderPage(leafIndex)}
              <div className="book-shade book-shade-front" />
            </div>
            <div className="book-face book-face-back">
              <div className="book-shade book-shade-back" />
            </div>
          </div>
        ) : null}
      </div>

      <BookControls
        current={current}
        lastIndex={lastIndex}
        onPrev={() => goTo(current - 1)}
        onNext={() => goTo(current + 1)}
        onContents={() => goTo(0)}
      />
    </div>
  );
}

function BookControls({
  current,
  lastIndex,
  onPrev,
  onNext,
  onContents,
}: {
  current: number;
  lastIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onContents: () => void;
}) {
  return (
    <nav
      aria-label="페이지 이동"
      className="border-rule bg-paper/95 font-hand shrink-0 border-t backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-md items-stretch gap-2 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <ArrowButton
          onClick={onPrev}
          disabled={current === 0}
          label="앞 페이지"
          side="left"
        />

        {current === 0 ? (
          // 이미 목차 면이라 누를 곳이 아니다. 위치만 지키는 표시로 둔다.
          <div className="border-rule/70 text-ink-muted flex min-h-11 flex-1 flex-col items-center justify-center rounded-lg border border-dashed">
            <span className="text-lg leading-none">표지</span>
            <span className="mt-1 text-sm leading-none tabular-nums">
              총 {lastIndex}장
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onContents}
            className="border-rule text-ink-soft hover:border-rule-strong hover:text-ribbon flex min-h-11 flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border transition-colors"
          >
            <span className="text-lg leading-none">목차</span>
            <span className="text-ink-muted mt-1 text-sm leading-none tabular-nums">
              {current} / {lastIndex}
            </span>
          </button>
        )}

        <ArrowButton
          onClick={onNext}
          disabled={current === lastIndex}
          label="뒤 페이지"
          side="right"
        />
      </div>
    </nav>
  );
}

function ArrowButton({
  onClick,
  disabled,
  label,
  side,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  side: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="border-rule text-ink-soft hover:border-rule-strong hover:text-ribbon flex min-h-11 w-[4.5rem] cursor-pointer items-center justify-center gap-1 rounded-lg border transition-colors disabled:cursor-default disabled:opacity-35 disabled:hover:border-[var(--rule)] disabled:hover:text-[var(--ink-soft)]"
    >
      {side === "left" ? (
        <>
          <ChevronIcon className="size-4 rotate-180" />
          <span className="text-lg leading-none">이전</span>
        </>
      ) : (
        <>
          <span className="text-lg leading-none">다음</span>
          <ChevronIcon className="size-4" />
        </>
      )}
    </button>
  );
}

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function clamp(index: number, lastIndex: number) {
  return Math.min(Math.max(index, 0), Math.max(lastIndex, 0));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
