import Link from 'next/link';

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;
  const pagePath = (p: number) => p === 1 ? basePath : `${basePath}?page=${p}`;

  return (
    <div className="flex gap-1 flex-wrap mt-6">
      {currentPage > 1 && (
        <Link href={pagePath(currentPage - 1)}
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
          className="px-3 py-1.5 rounded text-xs hover:border-[var(--accent)] transition-colors"
        >← Prev</Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link key={p} href={pagePath(p)}
          style={{
            background: p === currentPage ? 'var(--accent)' : 'var(--card)',
            border: '1px solid var(--border)',
            color: p === currentPage ? 'var(--accent-fg)' : 'var(--text)',
          }}
          className="px-3 py-1.5 rounded text-xs hover:opacity-90 transition-opacity"
        >{p}</Link>
      ))}
      {currentPage < totalPages && (
        <Link href={pagePath(currentPage + 1)}
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
          className="px-3 py-1.5 rounded text-xs hover:border-[var(--accent)] transition-colors"
        >Next →</Link>
      )}
    </div>
  );
}