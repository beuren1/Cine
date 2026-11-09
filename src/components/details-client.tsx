"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, Play, Star } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import { MovieCard } from "@/components/movie-card";
import { TrailerDialog } from "@/components/trailer-dialog";
import { getCredits, getRecommendations, getTitle, getVideos } from "@/lib/tmdb/client";
import { formatRating } from "@/lib/utils";
import { titleName, titleYear, type MediaType, type TmdbVideo } from "@/types/tmdb";

export function DetailsClient({ mediaType, id }: { mediaType: MediaType; id: number }) {
  const [trailer, setTrailer] = useState<TmdbVideo | null>(null);
  const closeTrailer = useCallback(() => setTrailer(null), []);
  const title = useQuery({ queryKey: ["title", mediaType, id], queryFn: () => getTitle(mediaType, id) });
  const credits = useQuery({ queryKey: ["credits", mediaType, id], queryFn: () => getCredits(mediaType, id) });
  const videos = useQuery({ queryKey: ["videos", mediaType, id], queryFn: () => getVideos(mediaType, id) });
  const recommendations = useQuery({ queryKey: ["recommendations", mediaType, id], queryFn: () => getRecommendations(mediaType, id) });

  if (title.isLoading) return <main className="page-shell"><div className="skeleton detail-skeleton" /></main>;
  if (title.isError || !title.data) return <main className="page-shell"><div className="state-panel error-panel"><h1>Não foi possível carregar este título</h1><p>{title.error?.message ?? "Título não encontrado."}</p><Link className="button button-outline" href="/">Voltar ao início</Link></div></main>;

  const item = title.data;
  const trailerVideo = videos.data?.results.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.official)
    ?? videos.data?.results.find((video) => video.site === "YouTube" && video.type === "Trailer");
  const hours = item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}min` : null;

  return (
    <main>
      <section className="detail-hero">
        {item.backdrop_path && <Image src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`} alt="" fill priority sizes="100vw" className="detail-backdrop" />}
        <div className="detail-shade" />
        <div className="detail-content page-shell">
          <Link href="/" className="back-link"><ArrowLeft size={16} /> Voltar</Link>
          <p className="eyebrow">{mediaType === "tv" ? "SÉRIE" : "FILME"}{item.original_language ? ` · ${item.original_language.toUpperCase()}` : ""}</p>
          <h1>{titleName(item)}</h1>
          {item.tagline && <p className="detail-tagline">“{item.tagline}”</p>}
          <div className="detail-facts">
            {titleYear(item) && <span><CalendarDays size={15} />{titleYear(item)}</span>}
            <span className="detail-rating"><Star size={15} fill="currentColor" />{formatRating(item.vote_average)} <small>({item.vote_count?.toLocaleString("pt-BR") ?? "0"} votos)</small></span>
            {hours && <span><Clock3 size={15} />{hours}</span>}
            {item.number_of_seasons && <span>{item.number_of_seasons} temporadas · {item.number_of_episodes} episódios</span>}
          </div>
          <div className="genre-list">{item.genres?.map((genre) => <span key={genre.id}>{genre.name}</span>)}</div>
          <p className="detail-overview">{item.overview || "Sinopse ainda não disponível para este título."}</p>
          <div className="detail-actions">
            {trailerVideo && <button className="button button-primary" onClick={() => setTrailer(trailerVideo)}><Play size={16} fill="currentColor" /> Assistir trailer</button>}
            <FavoriteButton item={item} mediaType={mediaType} />
            <FavoriteButton item={item} mediaType={mediaType} status="watchlist" />
            <FavoriteButton item={item} mediaType={mediaType} status="watched" />
          </div>
        </div>
      </section>
      {!trailerVideo && videos.isError && <div className="page-shell trailer-unavailable" role="status">Não foi possível consultar os trailers: {videos.error.message}</div>}
      {!trailerVideo && !videos.isLoading && !videos.isError && <div className="page-shell trailer-unavailable">Trailer oficial indisponível para este título.</div>}
      {credits.data?.cast.length ? <section className="page-shell cast-section"><div className="row-heading"><div><p className="eyebrow">QUEM FAZ A HISTÓRIA</p><h2>Elenco principal</h2></div></div><div className="cast-rail">{credits.data.cast.slice(0, 12).map((person) => <div className="cast-card" key={person.id}>{person.profile_path ? <Image src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name} width={110} height={110} className="cast-avatar" /> : <div className="cast-avatar cast-fallback">{person.name.charAt(0)}</div>}<strong>{person.name}</strong><span>{person.character}</span></div>)}</div></section> : credits.isError ? <p className="page-shell subtle-error" role="status">Elenco indisponível: {credits.error.message}</p> : null}
      {recommendations.data?.results.length ? <section className="page-shell detail-recommendations"><div className="row-heading"><div><p className="eyebrow">NA MESMA VIBE</p><h2>Você também pode gostar</h2></div></div><div className="card-grid recommendation-grid">{recommendations.data.results.slice(0, 6).map((recommended, index) => <MovieCard key={recommended.id} item={recommended} mediaType={mediaType} index={index} />)}</div></section> : recommendations.isError ? <p className="page-shell subtle-error" role="status">Recomendações indisponíveis: {recommendations.error.message}</p> : null}
      <TrailerDialog video={trailer} onClose={closeTrailer} />
    </main>
  );
}
