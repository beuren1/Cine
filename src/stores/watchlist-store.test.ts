import { beforeEach, describe, expect, it } from "vitest";
import { useWatchlistStore } from "@/stores/watchlist-store";
import type { TmdbTitle } from "@/types/tmdb";

const item: TmdbTitle = {
  id: 42,
  title: "Teste",
  overview: "",
  poster_path: null,
  backdrop_path: null,
  vote_average: 8,
};

describe("watchlist store", () => {
  beforeEach(() => {
    useWatchlistStore.setState({ entries: [] });
  });

  it("adds a title to a status and removes it when toggled again", () => {
    useWatchlistStore.getState().setStatus(item, "movie", "favorite");
    expect(useWatchlistStore.getState().getStatus(42, "movie")).toBe("favorite");
    useWatchlistStore.getState().setStatus(item, "movie", "favorite");
    expect(useWatchlistStore.getState().entries).toHaveLength(0);
  });

  it("keeps the same ID separate for movies and series", () => {
    useWatchlistStore.getState().setStatus(item, "movie", "favorite");
    useWatchlistStore.getState().setStatus(item, "tv", "watched");
    expect(useWatchlistStore.getState().entries).toHaveLength(2);
    expect(useWatchlistStore.getState().getStatus(42, "tv")).toBe("watched");
  });

  it("updates a title's category without duplicating it", () => {
    useWatchlistStore.getState().setStatus(item, "movie", "favorite");
    useWatchlistStore.getState().setStatus(item, "movie", "watchlist");
    expect(useWatchlistStore.getState().entries).toHaveLength(1);
    expect(useWatchlistStore.getState().getStatus(42, "movie")).toBe("watchlist");
  });
});
