import Link from 'next/link';
import BoardCard from '@/components/BoardCard';
import Pagination from '@/components/Pagination';

async function getBoards(page: number) {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const res = await fetch(`${base}/api/boards?page=${page}`, {
    next: { revalidate: 30 },
    cache: 'no-store', // prevents stale data during dev
  });

  if (!res.ok) {
    return { boards: [], total: 0, pages: 1 };
  }

  return res.json();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;

  const pageNumber = Number(sp?.page);
  const page = Number.isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;

  const { boards, total, pages } = await getBoards(page);

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ color: 'var(--text)' }} className="text-3xl font-bold mb-2">
          Discussion Boards
        </h1>
        <p style={{ color: 'var(--muted)' }} className="text-sm">
          {total} active board{total !== 1 ? 's' : ''}. Anonymous. Per-thread IDs.
        </p>
      </div>

      {boards.length === 0 ? (
        <div
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          className="rounded-lg p-12 text-center"
        >
          <p style={{ color: 'var(--muted)' }} className="text-sm mb-4">
            No boards yet. Be the first.
          </p>

          <Link
            href="/new-board"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
            className="inline-block px-4 py-2 rounded text-sm font-medium hover:opacity-90"
          >
            Create a Board
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {boards.map((board: any) => (
            <BoardCard key={board._id} board={board} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={page} totalPages={pages} basePath="/" />
        </div>
      )}
    </div>
  );
}