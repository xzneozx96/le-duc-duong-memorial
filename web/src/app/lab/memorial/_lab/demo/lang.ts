"use client";

// The demo's language choice: kept in localStorage, read after hydration, and written to
// <html lang>. The first paint is Vietnamese; a browser set to German switches to German.
import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { Lang } from "../content";

const KEY = "memorial-demo-lang";
const listeners = new Set<() => void>();
let memory: Lang | null = null;

function read(): Lang {
  if (memory) return memory;
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "vi" || stored === "de") return stored;
  } catch {
    // storage blocked: the switch still works for this visit
  }
  return window.navigator.language.toLowerCase().startsWith("de") ? "de" : "vi";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useDemoLang(): [Lang, (l: Lang) => void] {
  const lang = useSyncExternalStore<Lang>(subscribe, read, () => "vi");

  useEffect(() => {
    const before = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = before;
    };
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    memory = next;
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // kept in memory only
    }
    listeners.forEach((l) => l());
  }, []);

  return [lang, setLang];
}
