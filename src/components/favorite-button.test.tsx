import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { FavoriteButton } from "@/components/favorite-button";
import { useWatchlistStore } from "@/stores/watchlist-store";
import type { TmdbTitle } from "@/types/tmdb";

const item: TmdbTitle = {
  id: 9,
  title: "Uma história",
  overview: "",
  poster_path: null,
  backdrop_path: null,
  vote_average: 0,
};

describe("FavoriteButton", () => {
  beforeEach(() => useWatchlistStore.setState({ entries: [] }));

  it("adds and removes a favorite accessibly", () => {
    render(<FavoriteButton item={item} mediaType="movie" />);
    const button = screen.getByRole("button", { name: "Adicionar a Favorito" });
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Remover de Favorito" })).toHaveAttribute("aria-pressed", "true");
    expect(useWatchlistStore.getState().getStatus(9, "movie")).toBe("favorite");
    fireEvent.click(screen.getByRole("button", { name: "Remover de Favorito" }));
    expect(useWatchlistStore.getState().entries).toHaveLength(0);
  });
});
