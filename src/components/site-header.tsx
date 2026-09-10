import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    // 모바일에서는 머리말을 두지 않는다. sticky 가 <body> 를 기준으로 붙어야 해서
    // 감싸는 div 대신 이 요소가 직접 화면 크기를 가린다.
    <header className="border-rule bg-paper/85 sticky top-0 z-40 hidden shrink-0 border-b backdrop-blur lg:block">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-lg tracking-tight">
            {siteConfig.name}
          </span>
          <span className="text-ink-muted hidden text-xs sm:inline">
            {siteConfig.tagline}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <a
            href={siteConfig.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted hover:text-ink rounded-md px-2 py-1 text-xs transition-colors"
          >
            원본 레포
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
