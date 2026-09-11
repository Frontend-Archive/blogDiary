"use client";

import { useSfx } from "@/hooks/use-sfx";

/*
 * 원본(page_turn_sound.wav, 4.87초 1.3MB)에서 넘김 소리가 나는 1.10~3.10초만 잘라
 * 정규화(+33dB)해 AAC 로 옮긴 것. 29KB.
 * 원본은 -27dBFS 로 매우 작게 녹음돼 있어 그대로 쓰면 폰 스피커에서 들리지 않는다.
 */
const SOURCE = "/sound/page-turn.m4a";

/** 넘김 소리는 기척 정도면 된다. 약 -22dB. */
const VOLUME = 0.08;

/*
 * 소리를 끊는 지점. 음원이 이미 2초라 평소에는 자연히 끝나지만,
 * 나중에 더 긴 파일로 바뀌어도 넘김 소리가 길게 늘어지지 않도록 남겨 둔다.
 */
const PLAY_MS = 2000;

/*
 * 데스크톱에서는 소리를 내지 않는다.
 * `/` 는 넘기는 동작이 아예 없고, `/p/[id]` 의 책도 화면 한가운데 놓인 읽을거리라
 * 소리까지 날 자리는 아니다. 레이아웃을 가르는 lg(1024px) 와 같은 기준을 쓴다.
 */
const MOBILE = "(max-width: 1023px)";

/**
 * 책장 넘기는 소리.
 * 넘김이 실제로 일어날 때 호출하면 된다.
 */
export function usePageTurnSound() {
  return useSfx(SOURCE, { volume: VOLUME, maxMs: PLAY_MS, when: MOBILE });
}
