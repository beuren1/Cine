import type {
  MediaType,
  TmdbCredits,
  TmdbGenre,
  TmdbPage,
  TmdbTitle,
  TmdbVideos,
} from "@/types/tmdb";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

function isApiErrorPayload(value: unknown): value is { error: string } {
  return typeof value === "object"
    && value !== null
    && "error" in value
    && typeof value.error === "string";
}

export async function tmdbFetch<T>(path: string, params?: URLSearchParams): Promise<T> {
  const query = params?.toString();
  const response = await fetch(`/api/tmdb/${path}${query ? `?${query}` : ""}`);
  const payload: unknown = await response.json();
  if (!response.ok) {
    throw new ApiError(
      isApiErrorPayload(payload) ? payload.error : "Não foi possível carregar os títulos.",
      response.status,
    );
  }
  return payload as T;
}

export const getTitle = (type: MediaType, id: number) =>
  tmdbFetch<TmdbTitle>(`${type}/${id}?language=pt-BR`);

export const getCredits = (type: MediaType, id: number) =>
  tmdbFetch<TmdbCredits>(`${type}/${id}/credits?language=pt-BR`);

export const getVideos = (type: MediaType, id: number) =>
  tmdbFetch<TmdbVideos>(`${type}/${id}/videos?language=pt-BR`);

export const getRecommendations = (type: MediaType, id: number) =>
  tmdbFetch<TmdbPage<TmdbTitle>>(`${type}/${id}/recommendations?language=pt-BR`);

export const getGenres = (type: MediaType) =>
  tmdbFetch<{ genres: TmdbGenre[] }>(`genre/${type}/list?language=pt-BR`);
