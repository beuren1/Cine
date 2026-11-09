import "server-only";
import type { TmdbTitle } from "@/types/tmdb";

const API_BASE = "https://api.themoviedb.org/3";

export class TmdbError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "TmdbError";
  }
}

export async function getTmdb<T>(path: string): Promise<T> {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) {
    throw new TmdbError("Configure TMDB_READ_ACCESS_TOKEN para carregar títulos reais.", 503);
  }

  const response = await fetch(`${API_BASE}/${path.replace(/^\/+/, "")}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new TmdbError(
      response.status === 429
        ? "A TMDB limitou temporariamente as requisições. Tente novamente em instantes."
        : `A TMDB respondeu com erro (${response.status}).`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export async function getHomeCollections() {
  const paths = [
    "trending/movie/week?language=pt-BR",
    "movie/now_playing?language=pt-BR",
    "movie/top_rated?language=pt-BR",
    "tv/popular?language=pt-BR",
    "trending/tv/week?language=pt-BR",
  ];

  const [trending, newReleases, topRated, popularSeries, recommended] = await Promise.all(
    paths.map((path) => getTmdb<{ results: TmdbTitle[] }>(path)),
  );

  return {
    trending: trending.results,
    newReleases: newReleases.results,
    topRated: topRated.results,
    popularSeries: popularSeries.results,
    recommended: recommended.results,
  };
}
