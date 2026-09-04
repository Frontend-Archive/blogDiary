import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-rule bg-paper/85 sticky top-0 z-40 border-b backdrop-blur">
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
