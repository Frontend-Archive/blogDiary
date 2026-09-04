import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-5">
        <Link href="/" className="font-semibold tracking-tight">
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted hover:text-foreground rounded-md px-2 py-1 text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
