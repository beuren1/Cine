"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { tmdbFetch } from "@/lib/tmdb/client";
import { filterSearchResults } from "@/lib/catalog-filters";
import { MovieCard } from "@/components/movie-card";
import type { MediaType, TmdbPage, TmdbTitle } from "@/types/tmdb";

type SearchFilter = "all" | MediaType;

export function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  return <SearchResults key={initialQuery} initialQuery={initialQuery} />;
}

function SearchResults({ initialQuery }: { initialQuery: string }) {
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery.trim());
  const [filter, setFilter] = useState<SearchFilter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(input.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [input]);

  const results = useQuery({
    queryKey: ["search", query, page],
    enabled: query.length > 0,
    queryFn: () => tmdbFetch<TmdbPage<TmdbTitle>>(`search/multi?${new URLSearchParams({ query, page: String(page), include_adult: "false" }).toString()}`),
  });
  const items = filterSearchResults(results.data?.results ?? [], filter);

  return (
    <main className="page-shell search-page">
      <div className="page-heading"><p className="eyebrow">SEU PRÓXIMO PLAY COMEÇA AQUI</p><h1>Buscar<span>.</span></h1><p>Encontre filmes e séries para a próxima sessão.</p></div>
      <label className="search-field"><Search size={20} /><span className="sr-only">Buscar filmes e séries</span><input autoFocus value={input} onChange={(event) => setInput(event.target.value)} placeholder="Digite o nome de um título..." /></label>
      <div className="search-filters" aria-label="Filtrar resultados">
        {([{ value: "all", label: "Tudo" }, { value: "movie", label: "Filmes" }, { value: "tv", label: "Séries" }] as const).map((item) => (
          <button key={item.value} className={filter === item.value ? "filter-chip selected" : "filter-chip"} onClick={() => setFilter(item.value)}>{item.label}</button>
        ))}
        {results.data && <span>{results.data.total_results.toLocaleString("pt-BR")} resultados</span>}
      </div>
      {!query ? <div className="state-panel search-prompt"><Search size={30} /><h2>O que você quer assistir?</h2><p>Pesquise por título, nome original ou franquia.</p></div>
        : results.isLoading ? <div className="card-grid">{Array.from({ length: 8 }, (_, index) => <div key={index} className="skeleton skeleton-poster" />)}</div>
          : results.isError ? <div className="state-panel error-panel"><h2>Erro ao buscar títulos</h2><p>{results.error.message}</p><button className="button button-outline" onClick={() => void results.refetch()}>Tentar novamente</button></div>
            : items.length ? <div className="card-grid">{items.map((item, index) => <MovieCard key={`${item.media_type}-${item.id}`} item={item} mediaType={item.media_type} index={index} />)}</div>
              : <div className="state-panel"><h2>Nenhum resultado para “{query}”</h2><p>Confira a escrita ou experimente outro termo.</p></div>}
      {results.data && results.data.total_pages > 1 && <div className="pagination"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Anterior</button><span>Página {page} de {Math.min(results.data.total_pages, 500)}</span><button disabled={page >= Math.min(results.data.total_pages, 500)} onClick={() => setPage((value) => value + 1)}>Próxima</button></div>}
    </main>
  );
}
