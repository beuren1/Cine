import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, tmdbFetch } from "@/lib/tmdb/client";

afterEach(() => vi.unstubAllGlobals());

describe("TMDB browser service", () => {
  it("requests the same-origin protected API and parses JSON", async () => {
    const payload = { results: [] };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 200, headers: { "Content-Type": "application/json" } }),
    );
    vi.stubGlobal("fetch", fetchMock);
    await expect(tmdbFetch("movie/popular", new URLSearchParams({ page: "2" }))).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith("/api/tmdb/movie/popular?page=2");
  });

  it("surfaces API errors without returning an empty success value", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "Token ausente." }), { status: 503 }),
    ));
    await expect(tmdbFetch("movie/popular")).rejects.toMatchObject({
      name: "ApiError",
      message: "Token ausente.",
      status: 503,
    } satisfies Partial<ApiError>);
  });
});
