import Link from 'next/link';
import { IThread } from '@/types';

export default function ThreadCard({ thread }: { thread: IThread }) {
  const diff     = Date.now() - new Date(thread.lastBumpAt).getTime();
  const hoursAgo = Math.floor(diff / 3600000);
  const daysAgo  = Math.floor(diff / 86400000);
  const timeStr  =
    hoursAgo < 1  ? 'just now' :
    hoursAgo < 24 ? `${hoursAgo}h ago` :
    `${daysAgo}d ago`;

  return (
    <Link
      href={`/thread/${thread._id}`}
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      className="flex items-center justify-between p-3 rounded hover:border-[var(--accent)] transition-colors"
    >
      <span style={{ color: 'var(--text)' }} className="text-sm font-medium truncate">
        {thread.title}
      </span>
      <span style={{ color: 'var(--muted)' }} className="text-xs shrink-0 ml-4">{timeStr}</span>
    </Link>
  );
}