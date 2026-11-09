"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MediaType, TmdbTitle, WatchlistEntry, WatchStatus } from "@/types/tmdb";

interface WatchlistState {
  entries: WatchlistEntry[];
  setStatus: (item: TmdbTitle, mediaType: MediaType, status: WatchStatus) => void;
  remove: (id: number, mediaType: MediaType) => void;
  getStatus: (id: number, mediaType: MediaType) => WatchStatus | undefined;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      entries: [],
      setStatus: (item, mediaType, status) =>
        set((state) => {
          const current = state.entries.find(
            (entry) => entry.item.id === item.id && entry.mediaType === mediaType,
          );
          if (current?.status === status) {
            return {
              entries: state.entries.filter(
                (entry) => !(entry.item.id === item.id && entry.mediaType === mediaType),
              ),
            };
          }
          return {
            entries: [
              ...state.entries.filter(
                (entry) => !(entry.item.id === item.id && entry.mediaType === mediaType),
              ),
              { item, mediaType, status, addedAt: Date.now() },
            ],
          };
        }),
      remove: (id, mediaType) =>
        set((state) => ({
          entries: state.entries.filter(
            (entry) => !(entry.item.id === id && entry.mediaType === mediaType),
          ),
        })),
      getStatus: (id, mediaType) =>
        get().entries.find(
          (entry) => entry.item.id === id && entry.mediaType === mediaType,
        )?.status,
    }),
    {
      name: "cineverse-lista",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
