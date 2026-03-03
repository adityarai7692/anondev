import Link from 'next/link';
import { IBoard } from '@/types';

export default function BoardCard({ board }: { board: IBoard }) {
  const daysLeft =
    board.status === 'trial'
      ? Math.max(0, 7 - Math.floor((Date.now() - new Date(board.createdAt).getTime()) / 86400000))
      : null;

  const diff       = Date.now() - new Date(board.lastActivityAt).getTime();
  const hoursAgo   = Math.floor(diff / 3600000);
  const daysAgo    = Math.floor(diff / 86400000);
  const activityStr =
    hoursAgo < 1  ? 'just now' :
    hoursAgo < 24 ? `${hoursAgo}h ago` :
    `${daysAgo}d ago`;

  return (
    <Link
      href={`/boards/${board.slug}`}
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      className="flex items-center justify-between p-4 rounded-lg hover:border-[var(--accent)] transition-colors group"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span style={{ color: 'var(--accent)' }} className="font-mono text-sm font-semibold group-hover:underline">
            /{board.slug}/
          </span>
          {board.status === 'trial'
            ? <span className="text-yellow-500 text-xs font-medium">⚡ trial</span>
            : <span className="text-green-500 text-xs">✓</span>
          }
        </div>
        <p style={{ color: 'var(--muted)' }} className="text-xs truncate">{board.name}</p>
      </div>
      <div className="text-right text-xs shrink-0 ml-4" style={{ color: 'var(--muted)' }}>
        <div>{board.threadCount}t · {board.postCount}p</div>
        <div>{activityStr}</div>
        {daysLeft !== null && <div className="text-yellow-500">{daysLeft}d left</div>}
      </div>
    </Link>
  );
}