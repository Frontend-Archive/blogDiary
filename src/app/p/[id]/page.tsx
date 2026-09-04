import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookReader } from "@/components/book/book-reader";
import { fetchArchives } from "@/lib/archive";
import { loadArchives } from "@/lib/archive/load";
import { formatFullDate } from "@/lib/date";

// Next의 세그먼트 설정은 정적으로 분석되므로 리터럴이어야 한다.
// (lib/archive/config.ts의 REVALIDATE_SECONDS와 같은 값)
export const revalidate = 3600;

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  try {
    const { archives } = await fetchArchives();
    return archives.map((archive) => ({ id: String(archive.id) }));
  } catch {
    // 빌드 시점에 못 가져와도 요청이 올 때 만들어진다.
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const { archives } = await loadArchives();
  const archive = archives.find((item) => String(item.id) === id);

  if (!archive) return { title: "없는 지면" };
  return {
    title: archive.title,
    description: `${formatFullDate(archive.date)}에 나눈 글 모음`,
  };
}

export default async function BookPage({ params }: Params) {
  const { id } = await params;
  const { archives } = await loadArchives();
  const index = archives.findIndex((archive) => String(archive.id) === id) + 1;

  if (index === 0) notFound();

  return <BookReader archives={archives} initialIndex={index} />;
}
