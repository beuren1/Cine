import Link from "next/link";
import { AlertCircle, ArrowRight, Clapperboard, Film } from "lucide-react";
import { HeroFeature } from "@/components/hero-feature";
import { TitleRow } from "@/components/title-row";
import { getHomeCollections, TmdbError } from "@/lib/tmdb/server";
import type { TmdbTitle } from "@/types/tmdb";

export const revalidate = 300;

export default async function HomePage() {
  let collections: Awaited<ReturnType<typeof getHomeCollections>> | null = null;
  let error: string | null = null;
  try {
    collections = await getHomeCollections();
  } catch (cause) {
    error = cause instanceof TmdbError ? cause.message : "Não foi possível carregar os títulos da TMDB.";
  }

  const feature: TmdbTitle | undefined = collections?.trending[0];
  return (
    <main>
      {feature ? <HeroFeature item={feature} /> : <section className="hero-empty">
        <div className="hero-empty-grid" />
        <div className="hero-empty-content"><div className="hero-kicker"><span className="live-dot" /> UM UNIVERSO DE HISTÓRIAS</div><h1>Cada história<br />abre um <em>universo.</em></h1><p>Descubra filmes e séries, encontre sua próxima obsessão e crie sua própria lista de favoritos.</p><Link className="button button-primary" href="/filmes"><Clapperboard size={17} /> Explorar catálogo</Link></div>
        <div className="hero-orbit"><div /><div /><div /><span><Film size={34} /></span></div>
      </section>}

      {error && <div className="page-shell api-notice" role="status"><AlertCircle size={19} /><div><strong>Catálogo em pausa</strong><p>{error} Configure a variável no servidor para acessar dados reais.</p></div><Link href="/sobre">Como configurar <ArrowRight size={14} /></Link></div>}

      <div className="home-content">
        {collections ? <>
          <TitleRow title="Em alta agora" eyebrow="O QUE TODO MUNDO ESTÁ ASSISTINDO" items={collections.trending} href="/filmes" />
          <TitleRow title="Chegaram agora" eyebrow="NOVIDADES NA TELA" items={collections.newReleases} href="/filmes" />
          <TitleRow title="Histórias que ficam" eyebrow="NOTA ALTA, HISTÓRIAS MARCANTES" items={collections.topRated} href="/filmes" />
          <TitleRow title="Séries para maratonar" eyebrow="MAIS ASSISTIDAS DA SEMANA" items={collections.popularSeries} mediaType="tv" href="/series" />
          <TitleRow title="Talvez você curta" eyebrow="MAIS PARA DESCOBRIR" items={collections.recommended} />
        </> : <section className="page-shell discovery-prompt"><p className="eyebrow">EXPLORE SEM LIMITES</p><h2>Um catálogo inteiro espera por você.</h2><p>Conecte a API da TMDB para descobrir tendências, lançamentos e recomendações atualizadas.</p><div><Link href="/filmes" className="button button-outline">Ver filmes</Link><Link href="/series" className="button button-outline">Ver séries</Link></div></section>}
      </div>
    </main>
  );
}
