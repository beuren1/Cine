"use client";

import { useState } from "react";
import Link from "next/link";
import { MovieCard } from "@/components/movie-card";
import { useWatchlistStore } from "@/stores/watchlist-store";
import type { WatchStatus } from "@/types/tmdb";

const tabs: { value: WatchStatus; label: string }[] = [
  { value: "favorite", label: "Favoritos" },
  { value: "watchlist", label: "Quero assistir" },
  { value: "watched", label: "Já assistidos" },
];

export function WatchlistPage() {
  const [active, setActive] = useState<WatchStatus>("favorite");
  const entries = useWatchlistStore((state) => state.entries);
  const items = entries.filter((entry) => entry.status === active);
  return (
    <main className="page-shell watchlist-page">
      <div className="page-heading"><p className="eyebrow">SUA PRÓXIMA SESSÃO</p><h1>Minha lista<span>.</span></h1><p>Uma coleção pessoal de histórias que ficam com você.</p></div>
      <div className="watchlist-tabs" role="tablist" aria-label="Suas listas">
        {tabs.map((tab) => <button key={tab.value} role="tab" aria-selected={active === tab.value} className={active === tab.value ? "filter-chip selected" : "filter-chip"} onClick={() => setActive(tab.value)}>{tab.label}<span>{entries.filter((entry) => entry.status === tab.value).length}</span></button>)}
      </div>
      {items.length ? <div className="card-grid">{items.map((entry, index) => <MovieCard key={`${entry.mediaType}-${entry.item.id}`} item={entry.item} mediaType={entry.mediaType} actionStatus={active} index={index} />)}</div>
        : <div className="state-panel"><span className="empty-mark">CV</span><h2>Sua lista está vazia</h2><p>Adicione títulos enquanto explora e eles aparecerão aqui.</p><Link className="button button-primary" href="/filmes">Explorar filmes</Link></div>}
    </main>
  );
}
