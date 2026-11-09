import type { Metadata } from "next";
import { QueryProvider } from "@/providers/query-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cineverse.vercel.app"),
  title: { default: "CineVerse — cada história abre um universo", template: "%s | CineVerse" },
  description: "Descubra filmes e séries, explore o que está em alta e monte sua lista pessoal no CineVerse.",
  applicationName: "CineVerse",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "CineVerse",
    title: "CineVerse — cada história abre um universo",
    description: "Descubra sua próxima história favorita.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
