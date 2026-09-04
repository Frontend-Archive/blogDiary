import { fetchArchives } from "@/lib/archive/fetch";
import type { Archive } from "@/lib/archive/types";

export interface LoadResult {
  archives: Archive[];
  failures: { file: string; message: string }[];
  /** 수집이 통째로 실패했을 때의 안내 문구 */
  error?: string;
}

/**
 * 수집이 실패해도(네트워크 단절, GitHub 요청 한도 등) 페이지는 뜨게 한다.
 * 다음 재검증 때 다시 시도한다.
 */
export async function loadArchives(): Promise<LoadResult> {
  try {
    return await fetchArchives();
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    console.error("[archive] 목록을 가져오지 못했습니다:", message);
    return {
      archives: [],
      failures: [],
      error: `아카이브를 가져오지 못했습니다. ${message}`,
    };
  }
}
