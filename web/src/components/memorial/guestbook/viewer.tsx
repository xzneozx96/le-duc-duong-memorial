"use client";

// Full-screen photo viewer for the guestbook (the page's own is viewer.tsx one folder up), with the class prefix lbk:
// a modal <dialog> with worded controls, arrow keys, Escape, a swipe on touch screens, and one
// history entry so the phone's Back button closes it.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { classes } from "@/components/memorial/cls";
import { t } from "./data";

const s = classes("lbk");

export type ViewerPhoto = { src: string; w?: number; h?: number; caption: string };
type Open = (photos: ViewerPhoto[], index: number) => void;

const ViewerContext = createContext<Open>(() => {});
export const useViewer = () => useContext(ViewerContext);

const CLOSE_MS = 200;

export function ViewerProvider({ children }: { children: ReactNode }) {
  const v = t.viewer;
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const pushed = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [view, setView] = useState<{ photos: ViewerPhoto[]; index: number } | null>(null);
  const [closing, setClosing] = useState(false);
  const countId = useId();
  const captionId = useId();

  const open = useCallback<Open>((photos, index) => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setClosing(false);
    setView({ photos, index });
  }, []);

  const fadeOut = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      dialog.current?.close();
      setView(null);
      setClosing(false);
      opener.current?.focus({ preventScroll: true });
    }, CLOSE_MS);
  }, []);

  const requestClose = useCallback(() => {
    if (pushed.current) window.history.back();
    else fadeOut();
  }, [fadeOut]);

  const isOpen = view !== null;
  useEffect(() => {
    if (!isOpen) return;
    const el = dialog.current;
    if (el && !el.open) {
      el.showModal();
      closeButton.current?.focus();
      window.history.pushState(null, "");
      pushed.current = true;
    }
    const onPop = () => {
      pushed.current = false;
      fadeOut();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [isOpen, fadeOut]);

  const step = useCallback((by: number) => {
    setView((cur) => {
      if (!cur) return cur;
      const index = cur.index + by;
      return index < 0 || index >= cur.photos.length ? cur : { ...cur, index };
    });
  }, []);

  const photo = view?.photos[view.index];
  const total = view?.photos.length ?? 0;
  const atFirst = !view || view.index === 0;
  const atLast = !view || view.index === total - 1;

  return (
    <ViewerContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        className={s.viewer}
        data-closing={closing || undefined}
        aria-labelledby={`${countId} ${captionId}`}
        onCancel={(e) => {
          e.preventDefault();
          requestClose();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
      >
        {view && photo && (
          <div className={s.viewerGrid}>
            <p id={countId} className={s.viewerCount} aria-live="polite">
              {v.count(view.index + 1, total)}
            </p>
            <button ref={closeButton} type="button" className={`${s.ghost} ${s.viewerClose}`} onClick={requestClose}>
              <X aria-hidden size={24} strokeWidth={2} />
              {v.close}
            </button>
            <div
              className={s.viewerStage}
              onTouchStart={(e) => {
                const p = e.changedTouches[0];
                touch.current = { x: p.clientX, y: p.clientY };
              }}
              onTouchEnd={(e) => {
                const from = touch.current;
                touch.current = null;
                if (!from || e.touches.length > 0) return;
                const p = e.changedTouches[0];
                const dx = p.clientX - from.x;
                const dy = p.clientY - from.y;
                if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={photo.src} src={photo.src} width={photo.w} height={photo.h} alt="" className={s.viewerPhoto} />
            </div>
            <div className={s.viewerCaption} id={captionId}>
              <p>{photo.caption}</p>
            </div>
            {total > 1 && (
              <>
                <button
                  type="button"
                  className={`${s.ghost} ${s.viewerPrev}`}
                  aria-disabled={atFirst || undefined}
                  onClick={() => step(-1)}
                >
                  <ChevronLeft aria-hidden size={24} strokeWidth={2} />
                  {v.prev}
                </button>
                <button
                  type="button"
                  className={`${s.ghost} ${s.viewerNext}`}
                  aria-disabled={atLast || undefined}
                  onClick={() => step(1)}
                >
                  {v.next}
                  <ChevronRight aria-hidden size={24} strokeWidth={2} />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </ViewerContext.Provider>
  );
}
