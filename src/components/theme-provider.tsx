"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

interface ThemeContextValue {
  /** 사용자가 고른 값. 'system'이면 OS 설정을 따른다 */
  theme: Theme;
  /** 실제로 적용된 값 */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme은 ThemeProvider 안에서만 쓸 수 있습니다.");
  }
  return context;
}

/* ------------------------------------------------------------------ *
 * localStorage / matchMedia 를 외부 스토어로 두고 구독한다.
 * 서버 스냅샷이 따로 있어 하이드레이션 불일치가 생기지 않는다.
 * ------------------------------------------------------------------ */

const storeListeners = new Set<() => void>();

/** localStorage를 못 쓰는 환경(프라이빗 모드 등)에서의 대비책 */
let memoryTheme: Theme | null = null;

function notify() {
  for (const listener of storeListeners) listener();
}

function subscribeTheme(onChange: () => void) {
  storeListeners.add(onChange);
  // 다른 탭에서 바꾼 값도 따라간다.
  window.addEventListener("storage", onChange);
  return () => {
    storeListeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // 접근이 막히면 메모리에 들고 있던 값으로 대신한다.
  }
  return memoryTheme ?? "system";
}

function getServerTheme(): Theme {
  return "system";
}

function subscribeSystemTheme(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSystemDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

function getServerSystemDark(): boolean {
  return false;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getStoredTheme,
    getServerTheme,
  );
  const systemDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemDark,
    getServerSystemDark,
  );

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (systemDark ? "dark" : "light") : theme;

  // CSS가 OS 설정을 이미 따르고 있으므로, 사용자가 직접 고른 경우에만 표시를 남긴다.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = theme;
    }
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    memoryTheme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 저장에 실패해도 이번 세션에는 적용된다.
    }
    notify();
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
