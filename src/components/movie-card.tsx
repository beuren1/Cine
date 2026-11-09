"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Play, Star } from "lucide-react";
import { useState } from "react";
import { FavoriteButton } from "@/components/favorite-button";
import { formatRating } from "@/lib/utils";
import { titleName, titleYear, type MediaType, type TmdbTitle, type WatchStatus } from "@/types/tmdb";

export function MovieCard({
  item,
  mediaType = item.media_type ?? "movie",
  actionStatus = "favorite",
  index = 0,
}: {
  item: TmdbTitle;
  mediaType?: MediaType;
  actionStatus?: WatchStatus;
  index?: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const path = mediaType === "tv" ? "serie" : "filme";
  return (
    <motion.article
      className="movie-card"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -35px 0px" }}
      transition={{ duration: 0.35, delay: Math.min(index % 6, 5) * 0.035 }}
    >
      <div className="poster-wrap">
        <Link href={`/${path}/${item.id}`} className="poster-link" aria-label={`Ver detalhes de ${titleName(item)}`}>
          {item.poster_path && !imageFailed ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={`Pôster de ${titleName(item)}`}
              fill
              sizes="(max-width: 640px) 42vw, (max-width: 1024px) 24vw, 16vw"
              className="poster-image"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span className="poster-placeholder"><span>CV</span><small>{titleName(item)}</small></span>
          )}
          <span className="poster-play"><Play size={22} fill="currentColor" /></span>
        </Link>
        <div className="poster-actions"><FavoriteButton item={item} mediaType={mediaType} status={actionStatus} compact /></div>
        <span className="rating-badge"><Star size={12} fill="currentColor" /> {formatRating(item.vote_average)}</span>
      </div>
      <div className="card-meta">
        <Link href={`/${path}/${item.id}`} className="card-title">{titleName(item)}</Link>
        <div className="card-subtitle"><span>{titleYear(item) || "Data indisponível"}</span><span>{mediaType === "tv" ? "Série" : "Filme"}</span></div>
      </div>
    </motion.article>
  );
}
