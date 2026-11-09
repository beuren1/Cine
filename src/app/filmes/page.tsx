import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";

export const metadata: Metadata = { title: "Filmes", description: "Explore e filtre filmes disponíveis na TMDB." };

export default function MoviesPage() {
  return <Catalog mediaType="movie" />;
}
