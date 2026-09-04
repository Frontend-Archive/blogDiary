export const archiveRepo = {
  owner: "Frontend-Archive",
  name: "archive",
  branch: "main",
  /** 회차 md 파일이 들어 있는 디렉터리 */
  dir: "archives",
} as const;

/** 회차 파일명 규칙: YYYYMM.md (template/ 등 다른 항목은 제외) */
export const ARCHIVE_FILENAME = /^(\d{4})(\d{2})\.md$/;

/** 재검증 주기(초). Next의 fetch 캐시에 쓰인다. */
export const REVALIDATE_SECONDS = 60 * 60;

export function rawUrl(path: string): string {
  const { owner, name, branch } = archiveRepo;
  return `https://raw.githubusercontent.com/${owner}/${name}/${branch}/${path}`;
}

/**
 * GitHub의 파일 보기 링크.
 * plain 을 주면 `?plain=1` 이 붙어 렌더링된 문서 대신 md 원문이 그대로 보인다.
 */
export function blobUrl(path: string, options?: { plain?: boolean }): string {
  const { owner, name, branch } = archiveRepo;
  const url = `https://github.com/${owner}/${name}/blob/${branch}/${path}`;
  return options?.plain ? `${url}?plain=1` : url;
}

export function contentsApiUrl(path: string): string {
  const { owner, name, branch } = archiveRepo;
  return `https://api.github.com/repos/${owner}/${name}/contents/${path}?ref=${branch}`;
}
