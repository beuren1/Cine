import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";

export const metadata: Metadata = { title: "Séries", description: "Explore séries populares e encontre sua próxima maratona." };

export default function SeriesPage() {
  return <Catalog mediaType="tv" />;
}
