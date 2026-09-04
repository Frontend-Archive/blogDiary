import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-rule border-t">
      <div className="text-ink-muted mx-auto w-full max-w-6xl px-5 py-8 text-xs">
        © {new Date().getFullYear()} {siteConfig.name} · 데이터는
        Frontend-Archive/archive 레포에서 가져옵니다. 각 글의 저작권은
        작성자에게 있습니다.
      </div>
    </footer>
  );
}
