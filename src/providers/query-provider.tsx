"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useWatchlistStore } from "@/stores/watchlist-store";

export function QueryProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 300_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  useEffect(() => {
    void useWatchlistStore.persist.rehydrate();
  }, []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
