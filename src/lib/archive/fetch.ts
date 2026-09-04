import {
  ARCHIVE_FILENAME,
  REVALIDATE_SECONDS,
  archiveRepo,
  contentsApiUrl,
  rawUrl,
} from "@/lib/archive/config";
import { parseArchive } from "@/lib/archive/parse";
import type { Archive } from "@/lib/archive/types";

export class ArchiveFetchError extends Error {
  constructor(
    readonly url: string,
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ArchiveFetchError";
  }
}

interface ContentsEntry {
  name: string;
  path: string;
  type: "file" | "dir" | "symlink" | "submodule";
}

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // 인증 없이도 동작하지만(시간당 60회), 토큰이 있으면 넉넉해진다.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

async function request(url: string, headers?: HeadersInit): Promise<Response> {
  const response = await fetch(url, {
    headers,
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    const hint =
      response.status === 403
        ? " (GitHub API 요청 한도일 수 있습니다. GITHUB_TOKEN을 설정해 보세요.)"
        : "";
    throw new ArchiveFetchError(
      url,
      response.status,
      `${response.status} ${response.statusText}${hint}: ${url}`,
    );
  }

  return response;
}

/** archives/ 아래의 회차 파일명 목록. template/ 같은 디렉터리는 걸러진다. */
export async function listArchiveFiles(): Promise<string[]> {
  const response = await request(
    contentsApiUrl(archiveRepo.dir),
    githubHeaders(),
  );
  const entries = (await response.json()) as ContentsEntry[];

  return entries
    .filter((entry) => entry.type === "file")
    .map((entry) => entry.name)
    .filter((name) => ARCHIVE_FILENAME.test(name))
    .sort();
}

/** 회차 파일 하나를 받아 파싱한다. */
export async function fetchArchive(fileName: string): Promise<Archive> {
  const response = await request(rawUrl(`${archiveRepo.dir}/${fileName}`));
  return parseArchive(fileName, await response.text());
}

export interface FetchArchivesResult {
  archives: Archive[];
  /** 개별 파일에서 실패한 항목. 하나가 깨져도 나머지는 살린다. */
  failures: { file: string; message: string }[];
}

/** 모든 회차를 1회차부터(오래된 순으로) 가져온다. */
export async function fetchArchives(): Promise<FetchArchivesResult> {
  const files = await listArchiveFiles();
  const settled = await Promise.allSettled(files.map(fetchArchive));

  const archives: Archive[] = [];
  const failures: FetchArchivesResult["failures"] = [];

  settled.forEach((result, index) => {
    if (result.status === "fulfilled") {
      archives.push(result.value);
    } else {
      failures.push({
        file: files[index],
        message:
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
      });
    }
  });

  archives.sort((a, b) => a.date.localeCompare(b.date));
  return { archives, failures };
}
