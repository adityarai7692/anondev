import MarkdownRenderer from './MarkdownRenderer';
import ReactionBar from './ReactionBar';
import { IPost } from '@/types';

interface PostWithReactions extends IPost {
  reactions?: {
    counts: Record<string, number>;
    mine:   string[];
  };
}

export default function PostCard({
  post,
  myAnonId,
  replyNumber,
}: {
  post: PostWithReactions;
  myAnonId: string;
  replyNumber?: number;
}) {
  const isYou = post.anonId === myAnonId;
  const time  = new Date(post.createdAt).toLocaleString();

  return (
    <div
      style={{
        background:   isYou ? 'var(--card)' : 'var(--bg)',
        border:       `1px solid ${isYou ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '8px',
        overflow:     'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0.4rem 1rem',
          borderBottom:   '1px solid var(--border)',
          background:     isYou ? 'rgba(59,130,246,0.06)' : 'transparent',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {replyNumber && (
            <span style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 600 }}>
              #{replyNumber}
            </span>
          )}
          <code
            style={{
              fontFamily: 'monospace',
              fontSize:   '0.8rem',
              fontWeight: 700,
              color:      isYou ? 'var(--accent)' : 'var(--muted)',
            }}
          >
            Anon#{post.anonId}
          </code>
          {isYou && (
            <span
              style={{
                fontSize:     '0.65rem',
                background:   'var(--accent)',
                color:        'var(--accent-fg)',
                borderRadius: '999px',
                padding:      '0.1rem 0.45rem',
                fontWeight:   600,
              }}
            >
              you
            </span>
          )}
        </div>
        <time style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{time}</time>
      </div>

      {/* Body */}
      <div style={{ padding: '0.75rem 1rem' }}>
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Reactions */}
      <ReactionBar
        postId={post._id}
        initial={post.reactions}
      />
    </div>
  );
}