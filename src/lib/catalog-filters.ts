import type { MediaType, TmdbTitle } from "@/types/tmdb";

export interface CatalogFilterValues {
  genre: string;
  year: string;
  rating: string;
  page: number;
}

export function buildCatalogParams(
  mediaType: MediaType,
  filters: CatalogFilterValues,
): URLSearchParams {
  const params = new URLSearchParams({
    language: "pt-BR",
    page: String(filters.page),
    sort_by: "popularity.desc",
    include_adult: "false",
  });
  if (filters.genre) params.set("with_genres", filters.genre);
  if (filters.year) {
    params.set(mediaType === "movie" ? "primary_release_year" : "first_air_date_year", filters.year);
  }
  if (filters.rating) params.set("vote_average.gte", filters.rating);
  return params;
}

export interface SearchTitle extends TmdbTitle {
  media_type: MediaType;
}

export function filterSearchResults(
  items: TmdbTitle[],
  filter: "all" | MediaType,
): SearchTitle[] {
  return items.filter(
    (item): item is SearchTitle =>
      (item.media_type === "movie" || item.media_type === "tv")
      && (filter === "all" || item.media_type === filter),
  );
}
