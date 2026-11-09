import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link href="/" className="brand"><span className="brand-mark">CV</span><span>Cine<span>Verse</span></span></Link>
        <p>Feito para quem vive muitas vidas através do cinema.</p>
        <Link href="/sobre">Sobre o projeto</Link>
      </div>
      <p className="tmdb-credit">Este produto utiliza a API do TMDB, mas não é endossado ou certificado pelo TMDB.</p>
    </footer>
  );
}
