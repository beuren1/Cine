import Image from "next/image";
import Link from "next/link";
import { Play, Sparkles } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import { formatRating } from "@/lib/utils";
import { titleName, titleYear, type TmdbTitle } from "@/types/tmdb";

export function HeroFeature({ item }: { item: TmdbTitle }) {
  const title = titleName(item);
  return (
    <section className="hero-feature">
      {item.backdrop_path && <Image src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`} alt="" fill priority sizes="100vw" className="hero-backdrop" />}
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-kicker"><span className="live-dot" /> EM DESTAQUE <span className="hero-divider">/</span> <Sparkles size={13} /> SELEÇÃO CINEVERSE</div>
        <h1>{title}<span>.</span></h1>
        <div className="hero-meta"><span className="hero-rating">★ {formatRating(item.vote_average)}</span><span>{titleYear(item)}</span><span className="hero-content-label">{item.media_type === "tv" ? "Série" : "Filme"}</span></div>
        <p>{item.overview || "Uma nova história para descobrir. Explore os detalhes e conheça o elenco."}</p>
        <div className="hero-actions">
          <Link className="button button-primary" href={`/${item.media_type === "tv" ? "serie" : "filme"}/${item.id}`}><Play size={16} fill="currentColor" /> Explorar título</Link>
          <FavoriteButton item={item} mediaType={item.media_type ?? "movie"} />
        </div>
      </div>
      <div className="hero-index"><span>01</span> / DESTAQUE DA SEMANA</div>
    </section>
  );
}
