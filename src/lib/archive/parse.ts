import matter from "gray-matter";

import { blobUrl } from "@/lib/archive/config";
import type { Archive, Article, MeetingType } from "@/lib/archive/types";

export class ArchiveParseError extends Error {
  constructor(
    readonly file: string,
    message: string,
  ) {
    super(`${file}: ${message}`);
    this.name = "ArchiveParseError";
  }
}

const MEETING_TYPES: MeetingType[] = ["on-line", "off-line"];

/**
 * 회차 md 한 개를 Archive로 변환한다.
 * 레포는 사람이 직접 채우는 곳이라 값이 비거나 빠져 있을 수 있어,
 * 실패보다는 안전한 기본값으로 흡수하고 치명적인 것만 예외로 던진다.
 */
export function parseArchive(fileName: string, source: string): Archive {
  const slug = fileName.replace(/\.md$/, "");
  const { data, content } = matter(source);

  const id = Number(data.id);
  if (!Number.isInteger(id)) {
    throw new ArchiveParseError(fileName, `id가 정수가 아닙니다: ${data.id}`);
  }

  const date = normalizeDate(data.date);
  if (!date) {
    throw new ArchiveParseError(
      fileName,
      `date가 YYYY-MM-DD 형식이 아닙니다: ${String(data.date)}`,
    );
  }

  return {
    id,
    date,
    title: asString(data.title) || `스터디 ${id}회차`,
    type: normalizeType(data.type),
    articles: normalizeArticles(data.articles),
    slug,
    summary: content.trim().split("\n")[0]?.trim() ?? "",
    sourceUrl: blobUrl(`archives/${fileName}`, { plain: true }),
  };
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** YAML이 date를 Date 객체로 캐스팅하는 경우까지 흡수 */
function normalizeDate(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const text = asString(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

/** 템플릿의 따옴표 누락(`'off-line`)까지 감안해 느슨하게 판정 */
function normalizeType(value: unknown): MeetingType {
  const text = asString(value).replace(/^'|'$/g, "");
  return MEETING_TYPES.includes(text as MeetingType)
    ? (text as MeetingType)
    : "off-line";
}

function normalizeArticles(value: unknown): Article[] {
  if (!Array.isArray(value)) return [];

  return value.map((raw): Article => {
    const item = (raw ?? {}) as Record<string, unknown>;
    return {
      author: asString(item.author),
      title: asString(item.title),
      url: asString(item.url),
      tags: Array.isArray(item.tags)
        ? item.tags.map(asString).filter(Boolean)
        : [],
    };
  });
}
