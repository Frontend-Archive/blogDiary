import { siteConfig } from "@/lib/site";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {siteConfig.title}
        </h1>
        <p className="text-muted text-base">{siteConfig.description}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">최근 글</h2>
        <div className="border-border text-muted rounded-lg border border-dashed p-8 text-center text-sm">
          아직 작성된 글이 없습니다. 여기에 글 목록이 표시됩니다.
        </div>
      </section>
    </div>
  );
}
