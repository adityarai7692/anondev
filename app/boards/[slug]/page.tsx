import Link from 'next/link';
import ThreadCard from '@/components/ThreadCard';
import Pagination from '@/components/Pagination';
import { notFound } from 'next/navigation';

async function getBoardData(slug: string, page: number) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/boards/${slug}?page=${page}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  // ✅ unwrap both promises
  const p = await params;
  const sp = await searchParams;

  const page = Math.max(1, parseInt(sp?.page || '1'));

  const data = await getBoardData(p.slug, page);
  if (!data) notFound();

  const { board, threads, total, pages } = data;

  const daysLeft =
    board.status === 'trial'
      ? Math.max(
          0,
          7 - Math.floor((Date.now() - new Date(board.createdAt).getTime()) / 86400000)
        )
      : null;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/" style={{ color: 'var(--muted)' }} className="text-xs hover:underline">
            Home
          </Link>
          <span style={{ color: 'var(--muted)' }} className="text-xs">›</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 style={{ color: 'var(--text)' }} className="text-2xl font-bold">
              /{board.slug}/
            </h1>
            <p style={{ color: 'var(--muted)' }} className="text-sm mt-1">
              {board.name}
            </p>
          </div>

          <Link
            href={`/boards/${board.slug}/new`}
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
            className="text-xs px-3 py-2 rounded font-medium hover:opacity-90 whitespace-nowrap"
          >
            + New Thread
          </Link>
        </div>

        <div className="flex gap-4 mt-3 text-xs" style={{ color: 'var(--muted)' }}>
          <span>{board.threadCount} threads</span>
          <span>{board.postCount} posts</span>
          <span>score: {board.score}</span>

          {board.status === 'trial' ? (
            <span className="text-yellow-500 font-medium">
              ⚡ Trial — {daysLeft}d left
            </span>
          ) : (
            <span className="text-green-500 font-medium">✓ Permanent</span>
          )}
        </div>
      </div>

      {threads.length === 0 ? (
        <div
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          className="rounded-lg p-10 text-center"
        >
          <p style={{ color: 'var(--muted)' }} className="text-sm mb-4">
            No threads yet.
          </p>

          <Link
            href={`/boards/${board.slug}/new`}
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
            className="inline-block px-4 py-2 rounded text-sm"
          >
            Start the first thread
          </Link>
        </div>
      ) : (
        <div className="grid gap-2">
          {threads.map((thread: any) => (
            <ThreadCard key={thread._id} thread={thread} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pages}
          basePath={`/boards/${board.slug}`}
        />
      )}
    </div>
  );
}