import type { Metadata } from "next";
import { Clapperboard, ExternalLink, Heart, Layers3, Server, Sparkles } from "lucide-react";

export const metadata: Metadata = { title: "Sobre o CineVerse", description: "Conheça o projeto CineVerse e as tecnologias que o tornam possível." };

const stack = [
  { icon: Layers3, title: "Next.js & React", text: "App Router, Server Components e rotas tipadas." },
  { icon: Sparkles, title: "TypeScript", text: "Tipagem estrita do serviço à interface." },
  { icon: Server, title: "TanStack Query", text: "Cache, estados de carregamento e revalidação." },
  { icon: Heart, title: "Zustand", text: "Sua lista sincronizada com o armazenamento local." },
];

export default function AboutPage() {
  return (
    <main className="page-shell about-page">
      <div className="page-heading"><p className="eyebrow">POR TRÁS DA TELA</p><h1>Sobre o CineVerse<span>.</span></h1><p>Uma experiência de descoberta para quem acredita que toda grande história merece ser encontrada.</p></div>
      <section className="about-intro"><div className="about-icon"><Clapperboard size={30} /></div><div><h2>Um projeto feito para explorar.</h2><p>CineVerse é uma plataforma independente de descoberta de filmes e séries, criada para demonstrar uma experiência web moderna, responsiva e acessível. Os títulos, notas e informações do catálogo são carregados diretamente da API da TMDB. Favoritos e listas ficam salvos localmente no seu dispositivo.</p></div></section>
      <section className="tech-section"><p className="eyebrow">TECNOLOGIA POR TRÁS DA EXPERIÊNCIA</p><h2>Feito com propósito.</h2><div className="tech-grid">{stack.map(({ icon: Icon, title, text }) => <article className="tech-card" key={title}><Icon size={20} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="credits-card"><div className="tmdb-mark">TMDB</div><div><h2>Dados do catálogo</h2><p>Este produto utiliza a API do TMDB, mas não é endossado ou certificado pelo TMDB. Todos os dados e imagens de filmes e séries pertencem aos seus respectivos titulares.</p></div><a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> TMDB.org</a></section>
    </main>
  );
}
