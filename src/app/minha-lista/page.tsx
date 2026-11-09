import type { Metadata } from "next";
import { WatchlistPage } from "@/components/watchlist-page";

export const metadata: Metadata = { title: "Minha lista", description: "Seus filmes favoritos, para assistir e já assistidos." };

export default function MyListPage() {
  return <WatchlistPage />;
}
