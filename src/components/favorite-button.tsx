"use client";

import { Bookmark, Check, Heart, Eye } from "lucide-react";
import { useWatchlistStore } from "@/stores/watchlist-store";
import type { MediaType, TmdbTitle, WatchStatus } from "@/types/tmdb";

const labels: Record<WatchStatus, string> = {
  favorite: "Favorito",
  watchlist: "Quero assistir",
  watched: "Já assistido",
};

const icons = { favorite: Heart, watchlist: Bookmark, watched: Eye };

export function FavoriteButton({
  item,
  mediaType,
  status = "favorite",
  compact = false,
}: {
  item: TmdbTitle;
  mediaType: MediaType;
  status?: WatchStatus;
  compact?: boolean;
}) {
  const current = useWatchlistStore((state) =>
    state.entries.find((entry) => entry.item.id === item.id && entry.mediaType === mediaType)?.status,
  );
  const setStatus = useWatchlistStore((state) => state.setStatus);
  const active = current === status;
  const Icon = active ? Check : icons[status];

  return (
    <button
      type="button"
      className={`icon-action${active ? " is-active" : ""}${compact ? " compact" : ""}`}
      aria-label={`${active ? "Remover de" : "Adicionar a"} ${labels[status]}`}
      aria-pressed={active}
      title={`${active ? "Remover de" : "Adicionar a"} ${labels[status]}`}
      onClick={() => setStatus(item, mediaType, status)}
    >
      <Icon size={17} fill={active && status === "favorite" ? "currentColor" : "none"} />
      {!compact && <span>{active ? "Na sua lista" : labels[status]}</span>}
    </button>
  );
}
