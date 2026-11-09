export type MediaType = "movie" | "tv";

export interface TmdbTitle {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: TmdbGenre[];
  media_type?: MediaType;
  popularity?: number;
  original_language?: string;
  runtime?: number | null;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbPage<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbCredits {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }>;
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TmdbVideos {
  results: TmdbVideo[];
}

export type WatchStatus = "favorite" | "watchlist" | "watched";

export interface WatchlistEntry {
  item: TmdbTitle;
  mediaType: MediaType;
  status: WatchStatus;
  addedAt: number;
}

export function titleName(item: TmdbTitle): string {
  return item.title ?? item.name ?? item.original_title ?? item.original_name ?? "Título sem nome";
}

export function titleYear(item: TmdbTitle): string {
  const date = item.release_date ?? item.first_air_date;
  return date ? date.slice(0, 4) : "";
}
