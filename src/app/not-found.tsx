import Link from "next/link";

export default function NotFound() {
  return <main className="page-shell not-found"><p className="eyebrow">CENA NÃO ENCONTRADA · 404</p><h1>Essa história<br />não está por aqui.</h1><p>O endereço pode ter mudado ou o título não existe.</p><Link href="/" className="button button-primary">Voltar ao início</Link></main>;
}
