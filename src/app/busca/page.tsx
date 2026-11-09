import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "@/components/search-page";

export const metadata: Metadata = { title: "Buscar", description: "Pesquise filmes e séries no CineVerse." };

export default function SearchRoute() {
  return <Suspense fallback={<main className="page-shell"><div className="skeleton skeleton-heading" /></main>}><SearchPage /></Suspense>;
}
