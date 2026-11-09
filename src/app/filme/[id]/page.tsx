import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailsClient } from "@/components/details-client";
import { getTmdb, TmdbError } from "@/lib/tmdb/server";
import { titleName, type TmdbTitle } from "@/types/tmdb";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return { title: "Título não encontrado" };
  try {
    const item = await getTmdb<TmdbTitle>(`movie/${id}?language=pt-BR`);
    return { title: titleName(item), description: item.overview || "Detalhes do filme no CineVerse." };
  } catch (error) {
    if (error instanceof TmdbError && error.status === 404) return { title: "Título não encontrado" };
    return { title: "Filme | CineVerse" };
  }
}

export default async function MovieDetailsPage({ params }: Props) {
  const { id } = await params;
  if (!/^\d+$/.test(id) || Number(id) < 1) notFound();
  return <DetailsClient mediaType="movie" id={Number(id)} />;
}
