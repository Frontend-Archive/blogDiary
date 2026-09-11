"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useTheme } from "@/components/theme-provider";

/**
 * 테마 전환 버튼.
 *
 * 누르면 바로 바뀌지 않고 '잉크를 떨어뜨릴 곳을 고르는' 상태가 된다.
 * 그다음 화면 아무 데나 누르면 그 지점에서 새 테마가 번져 나간다.
 * 전환 연출을 못 쓰는 상황(미지원 브라우저·모션 축소)에서는 두 단계가 무의미하므로
 * 예전처럼 누르는 즉시 갈아끼운다.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [aiming, setAiming] = useState(false);

  const next = resolvedTheme === "dark" ? "light" : "dark";

  const canAnimate = () =>
    Boolean(document.startViewTransition) && !prefersReducedMotion();

  const press = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (aiming) {
      setAiming(false);
      return;
    }
    if (!canAnimate()) {
      setTheme(next);
      return;
    }

    // 키보드로 눌렀을 때는 찍을 지점이 없다(detail === 0).
    // 고르라고 해 봐야 고를 수단이 없으니 버튼 자리에서 바로 번지게 한다.
    if (event.detail === 0) {
      const box = event.currentTarget.getBoundingClientRect();
      spill(box.left + box.width / 2, box.top + box.height / 2, next, setTheme);
      return;
    }

    setAiming(true);
  };

  // 고르는 중 Esc 로 빠져나간다.
  useEffect(() => {
    if (!aiming) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAiming(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [aiming]);

  return (
    <>
      <button
        type="button"
        aria-label={aiming ? "잉크 떨어뜨리기 취소" : "테마 전환"}
        title={aiming ? "잉크 떨어뜨리기 취소" : "테마 전환"}
        aria-pressed={aiming}
        className={`inline-flex size-9 cursor-pointer items-center justify-center rounded-md border transition-colors ${
          aiming
            ? "border-ribbon text-ribbon"
            : "border-rule hover:border-rule-strong hover:text-ribbon text-ink-soft"
        }`}
        onClick={press}
      >
        {/* 아이콘 전환은 CSS로만 처리해 하이드레이션 불일치를 피합니다. */}
        <MoonIcon className="size-4 dark:hidden" />
        <SunIcon className="hidden size-4 dark:block" />
      </button>

      {aiming ? (
        <AimLayer
          onPick={(x, y) => {
            setAiming(false);
            spill(x, y, next, setTheme);
          }}
          onCancel={() => setAiming(false)}
        />
      ) : null}
    </>
  );
}

/**
 * 화면 전체를 덮어 다음 한 번의 누름을 받아내는 판.
 *
 * <body> 로 포털을 낸다. 이 버튼이 놓인 머리말에는 backdrop-blur 가 걸려 있는데,
 * backdrop-filter 는 position:fixed 자손의 기준 박스가 되어 버려서
 * 그냥 두면 판이 화면이 아니라 머리말 크기로 잘린다.
 */
function AimLayer({
  onPick,
  onCancel,
}: {
  onPick: (x: number, y: number) => void;
  onCancel: () => void;
}) {
  return createPortal(
    <div
      className="cursor-ink-brush fixed inset-0 z-[100]"
      // click 이 아니라 pointerdown 이라, 손가락이 닿는 순간 바로 번진다.
      onPointerDown={(event) => onPick(event.clientX, event.clientY)}
    >
      {/*
       * 안내는 눌러도 잉크가 떨어지도록 통과시키고, 취소 버튼만 눌림을 받는다.
       * 모바일에는 Esc 가 없어서 빠져나갈 곳이 눈에 보여야 한다.
       */}
      {/*
       * 좁은 화면에서는 오른쪽 위 테마 버튼과 겹치므로 그 아래로 내려앉힌다.
       * 데스크톱은 머리말 가운데가 비어 있어 top-6 으로도 부딪히지 않는다.
       */}
      <div className="pointer-events-none fixed inset-x-0 top-16 flex justify-center px-4 lg:top-6">
        <p className="border-rule-strong bg-paper text-ink ink-hint flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium shadow-lg">
          <DropIcon className="text-ink-soft size-4 shrink-0" />
          잉크를 떨어뜨릴 곳을 눌러 주세요
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={onCancel}
            className="border-rule text-ink-muted hover:border-rule-strong hover:text-ink pointer-events-auto ml-1 cursor-pointer rounded-full border px-2.5 py-0.5 text-xs"
          >
            취소
          </button>
        </p>
      </div>
    </div>,
    document.body,
  );
}

/** 찍은 자리를 CSS에 넘기고 전환을 연다. 번지는 그림은 globals.css 가 그린다. */
function spill(
  x: number,
  y: number,
  next: "light" | "dark",
  setTheme: (theme: "light" | "dark") => void,
) {
  const root = document.documentElement;
  root.style.setProperty("--ink-x", `${x}px`);
  root.style.setProperty("--ink-y", `${y}px`);

  if (!document.startViewTransition) {
    setTheme(next);
    return;
  }
  document.startViewTransition(() => setTheme(next));
}

/** 잉크 한 방울 */
function DropIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.6c.3 0 5.9 6.4 5.9 10.6a5.9 5.9 0 1 1-11.8 0C6.1 9 11.7 2.6 12 2.6Z" />
    </svg>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
