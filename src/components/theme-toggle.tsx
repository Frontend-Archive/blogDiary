"use client";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = resolvedTheme === "dark" ? "light" : "dark";

    // 지원하지 않는 브라우저나 모션을 줄이려는 설정에서는 그냥 갈아끼운다.
    if (!document.startViewTransition || prefersReducedMotion()) {
      setTheme(next);
      return;
    }

    // 잉크가 번져 나갈 지점 = 누른 버튼의 한가운데.
    // 전환 의사코드는 CSS(globals.css)가 이 두 값만 보고 그린다.
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--ink-x", `${left + width / 2}px`);
    root.style.setProperty("--ink-y", `${top + height / 2}px`);

    document.startViewTransition(() => setTheme(next));
  };

  return (
    <button
      type="button"
      aria-label="테마 전환"
      title="테마 전환"
      className="border-rule hover:border-rule-strong hover:text-ribbon text-ink-soft inline-flex size-9 cursor-pointer items-center justify-center rounded-md border transition-colors"
      onClick={toggle}
    >
      {/* 아이콘 전환은 CSS로만 처리해 하이드레이션 불일치를 피합니다. */}
      <MoonIcon className="size-4 dark:hidden" />
      <SunIcon className="hidden size-4 dark:block" />
    </button>
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
