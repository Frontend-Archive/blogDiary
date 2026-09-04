import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <div className="text-muted mx-auto w-full max-w-3xl px-5 py-8 text-sm">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
