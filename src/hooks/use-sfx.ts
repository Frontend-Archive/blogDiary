"use client";

import { useCallback, useEffect, useRef } from "react";

export interface SfxOptions {
  /**
   * 재생 음량(0~1, 진폭 배율). 0.2 는 약 -14dB.
   *
   * 음원은 피크 -3dBFS 로 여유 있게 구워 두고 음량은 여기서만 줄인다.
   * 파일을 작게 만들어 두면 나중에 키울 여지가 없어 다시 인코딩해야 한다.
   */
  volume: number;
  /** 이 시간이 지나면 끊는다. 음원이 이미 짧으면 줄 필요 없다. */
  maxMs?: number;
  /** 이 미디어 쿼리에 맞을 때만 소리를 낸다. 없으면 어디서나 낸다. */
  when?: string;
}

/**
 * 짧은 효과음 하나를 재생하는 훅. 재생할 시점에 돌려받은 함수를 부르면 된다.
 *
 * 소리는 거들 뿐이라 어디서 막히든 조용히 넘어간다.
 * 자동재생 정책에 걸리든 파일을 못 받든, 그 때문에 동작이 멈추면 안 된다.
 */
export function useSfx(
  source: string,
  { volume, maxMs, when }: SfxOptions,
): () => void {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopRef = useRef(0);

  useEffect(() => {
    // 처음 소리를 낼 때 늦지 않도록 미리 받아 둔다.
    const audio = new Audio(source);
    audio.preload = "auto";
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      window.clearTimeout(stopRef.current);
      audio.pause();
      audioRef.current = null;
    };
  }, [source, volume]);

  return useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (when && !window.matchMedia(when).matches) return;

    // 연달아 부르면 겹쳐 쌓지 말고 처음부터 다시 낸다.
    window.clearTimeout(stopRef.current);
    if (audio.currentTime) audio.currentTime = 0;
    void audio.play().catch(() => {});

    if (!maxMs) return;
    stopRef.current = window.setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, maxMs);
  }, [maxMs, when]);
}
