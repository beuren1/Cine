"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { TmdbVideo } from "@/types/tmdb";

export function TrailerDialog({
  video,
  onClose,
}: {
  video: TmdbVideo | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!video) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>("button, iframe");
    focusable?.[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus();
    };
  }, [video, onClose]);

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          className="dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={dialogRef}
            className="trailer-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={video.name}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            <div className="dialog-heading"><div><p className="eyebrow">TRAILER OFICIAL</p><h2>{video.name}</h2></div><button onClick={onClose} aria-label="Fechar trailer"><X /></button></div>
            <div className="trailer-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.key)}?autoplay=1&rel=0`} title={video.name} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
