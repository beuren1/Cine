export default function Loading() {
  return <main className="page-shell"><div className="skeleton skeleton-heading" /><div className="card-grid">{Array.from({ length: 10 }, (_, index) => <div className="skeleton skeleton-poster" key={index} />)}</div></main>;
}
