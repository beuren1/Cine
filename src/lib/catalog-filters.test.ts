import { describe, expect, it } from "vitest";
import { buildCatalogParams, filterSearchResults } from "@/lib/catalog-filters";
import type { TmdbTitle } from "@/types/tmdb";

describe("buildCatalogParams", () => {
  it("applies movie filters and pagination", () => {
    const params = buildCatalogParams("movie", { genre: "28", year: "2024", rating: "7", page: 3 });
    expect(params.get("with_genres")).toBe("28");
    expect(params.get("primary_release_year")).toBe("2024");
    expect(params.get("vote_average.gte")).toBe("7");
    expect(params.get("page")).toBe("3");
    expect(params.get("include_adult")).toBe("false");
  });

  it("uses the TV release year field and omits empty filters", () => {
    const params = buildCatalogParams("tv", { genre: "", year: "2020", rating: "", page: 1 });
    expect(params.get("first_air_date_year")).toBe("2020");
    expect(params.has("with_genres")).toBe(false);
    expect(params.has("vote_average.gte")).toBe(false);
  });
});

describe("filterSearchResults", () => {
  const items = [
    { id: 1, media_type: "movie" },
    { id: 2, media_type: "tv" },
    { id: 3, media_type: "person" },
  ] as TmdbTitle[];

  it("returns only supported media types for the selected filter", () => {
    expect(filterSearchResults(items, "movie").map((item) => item.id)).toEqual([1]);
    expect(filterSearchResults(items, "tv").map((item) => item.id)).toEqual([2]);
    expect(filterSearchResults(items, "all").map((item) => item.id)).toEqual([1, 2]);
  });
});
