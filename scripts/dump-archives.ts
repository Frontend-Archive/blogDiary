/**
 * archive 레포에서 회차 데이터를 받아 그대로 콘솔에 찍는다.
 *   yarn archive:dump          # 요약 + 전체 JSON
 *   yarn archive:dump --json   # JSON만 (파일로 리다이렉트하기 좋음)
 */
import { fetchArchives, isFilled } from "@/lib/archive";

const jsonOnly = process.argv.includes("--json");

async function main() {
  const { archives, failures } = await fetchArchives();

  if (jsonOnly) {
    console.log(JSON.stringify(archives, null, 2));
    return;
  }

  console.log(`\n회차 ${archives.length}개\n`);

  for (const archive of archives) {
    const filled = archive.articles.filter(isFilled).length;
    console.log(
      `── ${archive.date}  ${archive.title}  [${archive.type}]  ` +
        `글 ${filled}/${archive.articles.length}  (${archive.slug}.md)`,
    );

    for (const article of archive.articles) {
      if (!isFilled(article)) {
        console.log(`   · ${article.author.padEnd(4)} (미작성)`);
        continue;
      }
      const tags = article.tags.length ? `  #${article.tags.join(" #")}` : "";
      console.log(`   · ${article.author.padEnd(4)} ${article.title}${tags}`);
      console.log(`     ${article.url}`);
    }
    console.log();
  }

  const total = archives.reduce((sum, a) => sum + a.articles.length, 0);
  const filled = archives.reduce(
    (sum, a) => sum + a.articles.filter(isFilled).length,
    0,
  );
  const authors = new Set(
    archives.flatMap((a) => a.articles.map((x) => x.author)).filter(Boolean),
  );
  const tags = new Set(
    archives.flatMap((a) => a.articles.flatMap((x) => x.tags)),
  );

  console.log("── 요약 ─────────────────────────────");
  console.log(`발표 슬롯 ${total}개 중 작성됨 ${filled}개`);
  console.log(`작성자 ${authors.size}명: ${[...authors].join(", ")}`);
  console.log(`태그 ${tags.size}종: ${[...tags].join(", ")}`);

  if (failures.length) {
    console.log("\n── 실패 ─────────────────────────────");
    for (const failure of failures) {
      console.log(`${failure.file}: ${failure.message}`);
    }
  }

  console.log("\n── 원본 데이터 ──────────────────────");
  console.dir(archives, { depth: null, maxArrayLength: null });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
