"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { tmdbFetch } from "@/lib/tmdb/client";
import { buildCatalogParams } from "@/lib/catalog-filters";
import { MovieCard } from "@/components/movie-card";
import type { MediaType, TmdbGenre, TmdbPage, TmdbTitle } from "@/types/tmdb";

export function Catalog({ mediaType }: { mediaType: MediaType }) {
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [page, setPage] = useState(1);
  const isMovie = mediaType === "movie";

  const genres = useQuery({
    queryKey: ["genres", mediaType],
    queryFn: () => tmdbFetch<{ genres: TmdbGenre[] }>(`genre/${mediaType}/list?language=pt-BR`),
  });
  const params = buildCatalogParams(mediaType, { genre, year, rating, page });

  const results = useQuery({
    queryKey: ["catalog", mediaType, genre, year, rating, page],
    queryFn: () => tmdbFetch<TmdbPage<TmdbTitle>>(`discover/${mediaType}?${params.toString()}`),
  });

  const currentYear = new Date().getFullYear();
  function resetPage(action: () => void) {
    action();
    setPage(1);
  }

  return (
    <main className="page-shell catalog-page">
      <div className="page-heading"><p className="eyebrow">{isMovie ? "A SÉTIMA ARTE" : "HISTÓRIAS EM EPISÓDIOS"}</p><h1>{isMovie ? "Filmes" : "Séries"}<span>.</span></h1><p>Encontre sua próxima história favorita entre milhares de títulos.</p></div>
      <div className="filter-bar" aria-label="Filtros do catálogo">
        <label>Gênero
          <select value={genre} onChange={(event) => resetPage(() => setGenre(event.target.value))}>
            <option value="">Todos os gêneros</option>
            {genres.data?.genres.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label>Ano
          <select value={year} onChange={(event) => resetPage(() => setYear(event.target.value))}>
            <option value="">Qualquer ano</option>
            {Array.from({ length: 60 }, (_, index) => currentYear - index).map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label>Avaliação mínima
          <select value={rating} onChange={(event) => resetPage(() => setRating(event.target.value))}>
            <option value="">Qualquer nota</option>
            <option value="6">6.0+</option><option value="7">7.0+</option><option value="8">8.0+</option>
          </select>
        </label>
        <span className="catalog-count">{results.data?.total_results.toLocaleString("pt-BR") ?? "—"} títulos</span>
      </div>
      {genres.isError && <p className="subtle-error" role="status">Os gêneros não puderam ser carregados: {genres.error.message}</p>}
      {results.isLoading ? <div className="card-grid">{Array.from({ length: 12 }, (_, index) => <div key={index} className="skeleton skeleton-poster" />)}</div>
        : results.isError ? <div className="state-panel error-panel"><h2>Não foi possível carregar o catálogo</h2><p>{results.error.message}</p><button className="button button-outline" onClick={() => void results.refetch()}>Tentar novamente</button></div>
          : results.data?.results.length ? <div className="card-grid">{results.data.results.map((item, index) => <MovieCard key={item.id} item={item} mediaType={mediaType} index={index} />)}</div>
            : <div className="state-panel"><h2>Nenhum título encontrado</h2><p>Tente ajustar os filtros para ampliar os resultados.</p></div>}
      {results.data && results.data.total_pages > 1 && <div className="pagination"><button disabled={page <= 1} onClick={() => { setPage((value) => value - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Anterior</button><span>Página {page} de {Math.min(results.data.total_pages, 500)}</span><button disabled={page >= Math.min(results.data.total_pages, 500)} onClick={() => { setPage((value) => value + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Próxima</button></div>}
    </main>
  );
}
