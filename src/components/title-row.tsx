"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, MoveUpRight } from "lucide-react";
import { MovieCard } from "@/components/movie-card";
import type { MediaType, TmdbTitle } from "@/types/tmdb";

export function TitleRow({
  title,
  eyebrow,
  items,
  mediaType = "movie",
  href,
}: {
  title: string;
  eyebrow?: string;
  items: TmdbTitle[];
  mediaType?: MediaType;
  href?: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  function scroll(direction: number) {
    rail.current?.scrollBy({ left: direction * rail.current.clientWidth * 0.78, behavior: "smooth" });
  }
  if (!items.length) return null;

  return (
    <section className="title-row">
      <div className="row-heading">
        <div><p className="eyebrow">{eyebrow ?? "ESCOLHAS PARA VOCÊ"}</p><h2>{title}</h2></div>
        <div className="row-controls">
          {href && <Link href={href} className="see-all">Ver todos <MoveUpRight size={14} /></Link>}
          <button aria-label={`Anterior: ${title}`} onClick={() => scroll(-1)}><ChevronLeft size={18} /></button>
          <button aria-label={`Próximo: ${title}`} onClick={() => scroll(1)}><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="title-rail" ref={rail}>
        {items.map((item, index) => <MovieCard key={`${mediaType}-${item.id}`} item={item} mediaType={mediaType} index={index} />)}
      </div>
    </section>
  );
}
