import PostCard from '@/components/PostCard';
import ReplyForm from '@/components/ReplyForm';
import Pagination from '@/components/Pagination';
import ReactionBar from '@/components/ReactionBar';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';

async function getThreadData(threadId: string, page: number) {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const res = await fetch(
    `${base}/api/threads/${threadId}?page=${page}`,
    { cache: 'no-store' }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function ThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ threadId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  // ✅ unwrap promises (Next 16 requirement)
  const { threadId } = await params;
  const sp = await searchParams;

  const pageNumber = Number(sp?.page);
  const page =
    Number.isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;

  const data = await getThreadData(threadId, page);
  if (!data) notFound();

  const { thread, board, posts, myAnonId, total, pages } = data;

  const opPost = page === 1 ? posts[0] : null;
  const replies = page === 1 ? posts.slice(1) : posts;

  return (
    <div>
      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          fontSize: '0.75rem',
          color: 'var(--muted)',
        }}
      >
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>›</span>
        {board && (
          <>
            <Link
              href={`/boards/${board.slug}`}
              className="hover:underline"
            >
              /{board.slug}/
            </Link>
            <span>›</span>
          </>
        )}
        <span style={{ opacity: 0.6 }} className="truncate max-w-xs">
          {thread.title}
        </span>
      </div>

      {/* OP BLOCK */}
      {opPost && (
        <div
          style={{
            background: 'var(--card)',
            border: '2px solid var(--accent)',
            borderRadius: '12px',
            marginBottom: '2rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-fg)',
              padding: '0.5rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              📌 OP · Anon#{opPost.anonId}
              {opPost.anonId === myAnonId ? ' (you)' : ''} ·{' '}
              {new Date(opPost.createdAt).toLocaleString()}
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '999px',
                padding: '0.15rem 0.6rem',
                fontWeight: 700,
              }}
            >
              THREAD STARTER
            </span>
          </div>

          <div style={{ padding: '1.5rem' }}>
            <h1
              style={{
                color: 'var(--text)',
                fontSize: '1.6rem',
                fontWeight: 800,
              }}
            >
              {thread.title}
            </h1>

            <div style={{ marginTop: '1rem' }}>
              <MarkdownRenderer content={opPost.content} />
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border)',
              padding: '0.75rem 1.5rem',
              fontSize: '0.75rem',
              color: 'var(--muted)',
            }}
          >
            💬 {total - 1} {total - 1 === 1 ? 'reply' : 'replies'} ·
            Your ID:{' '}
            <code style={{ color: 'var(--accent)' }}>
              {myAnonId}
            </code>
          </div>

          <ReactionBar
            postId={opPost._id}
            initial={opPost.reactions}
          />
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {replies.map((post: any, idx: number) => (
            <PostCard
              key={post._id}
              post={post}
              myAnonId={myAnonId}
              replyNumber={idx + 2}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ marginTop: '2rem' }}>
          <Pagination
            currentPage={page}
            totalPages={pages}
            basePath={`/thread/${threadId}`}
          />
        </div>
      )}

      {/* Reply Form */}
      <ReplyForm threadId={threadId} boardSlug={board?.slug} />
    </div>
  );
}