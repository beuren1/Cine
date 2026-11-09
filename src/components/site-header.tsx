"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Clapperboard, Search } from "lucide-react";

const links = [
  { href: "/", label: "Início" },
  { href: "/filmes", label: "Filmes" },
  { href: "/series", label: "Séries" },
  { href: "/minha-lista", label: "Minha lista" },
];

export function SiteHeader() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (value) router.push(`/busca?q=${encodeURIComponent(value)}`);
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="CineVerse — página inicial">
          <span className="brand-mark"><Clapperboard size={20} strokeWidth={2.2} /></span>
          <span>Cine<span>Verse</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <form className="header-search" onSubmit={submitSearch} role="search">
          <Search size={17} aria-hidden="true" />
          <input
            aria-label="Buscar filmes e séries"
            placeholder="Buscar títulos..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" aria-label="Buscar"><span>Enter</span></button>
        </form>
      </div>
      <nav className="mobile-nav" aria-label="Navegação mobile">
        {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
    </header>
  );
}
