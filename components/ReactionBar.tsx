'use client';

import { useEffect, useState, useTransition } from 'react';

const EMOJI_REACTIONS = ['🔥', '💡', '😂', '👀', '💯'] as const;

interface ReactionData {
  counts: Record<string, number>;
  mine:   string[];
}

interface Props {
  postId:    string;
  postIds?:  string[]; // pass all postIds on first load for batch fetch
  initial?:  ReactionData;
}

export default function ReactionBar({ postId, initial }: Props) {
  const [data,       setData]       = useState<ReactionData>(
    initial || { counts: {}, mine: [] }
  );
  const [isPending,  startTransition] = useTransition();
  const [justClicked, setJustClicked] = useState<string | null>(null);

  const react = async (type: string) => {
    setJustClicked(type);

    // Optimistic update
    setData((prev) => {
      const alreadyMine = prev.mine.includes(type);
      const newCounts   = { ...prev.counts };
      let   newMine     = [...prev.mine];

      if (type === 'like' && !alreadyMine) {
        // remove dislike optimistically
        if (newMine.includes('dislike')) {
          newCounts['dislike'] = Math.max(0, (newCounts['dislike'] || 0) - 1);
          newMine = newMine.filter((t) => t !== 'dislike');
        }
      }
      if (type === 'dislike' && !alreadyMine) {
        if (newMine.includes('like')) {
          newCounts['like'] = Math.max(0, (newCounts['like'] || 0) - 1);
          newMine = newMine.filter((t) => t !== 'like');
        }
      }

      if (alreadyMine) {
        newCounts[type] = Math.max(0, (newCounts[type] || 0) - 1);
        newMine = newMine.filter((t) => t !== type);
      } else {
        newCounts[type] = (newCounts[type] || 0) + 1;
        newMine = [...newMine, type];
      }

      return { counts: newCounts, mine: newMine };
    });

    // Real request
    startTransition(async () => {
      try {
        await fetch('/api/reactions', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ postId, type }),
        });
      } catch {
        // silently fail — optimistic is fine
      }
      setTimeout(() => setJustClicked(null), 300);
    });
  };

  const likes    = data.counts['like']    || 0;
  const dislikes = data.counts['dislike'] || 0;
  const iLiked   = data.mine.includes('like');
  const iDisliked = data.mine.includes('dislike');

  return (
    <div
      style={{
        display:    'flex',
        alignItems: 'center',
        flexWrap:   'wrap',
        gap:        '0.375rem',
        padding:    '0.5rem 1rem',
        borderTop:  '1px solid var(--border)',
      }}
    >
      {/* Like button */}
      <button
        onClick={() => react('like')}
        title="Like"
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '0.3rem',
          padding:        '0.25rem 0.6rem',
          borderRadius:   '999px',
          fontSize:       '0.75rem',
          fontWeight:     600,
          cursor:         'pointer',
          transition:     'all 0.15s',
          border:         `1.5px solid ${iLiked ? '#22c55e' : 'var(--border)'}`,
          background:     iLiked ? 'rgba(34,197,94,0.12)' : 'transparent',
          color:          iLiked ? '#22c55e' : 'var(--muted)',
          transform:      justClicked === 'like' ? 'scale(1.15)' : 'scale(1)',
        }}
      >
        <span style={{ fontSize: '0.9rem' }}>👍</span>
        {likes > 0 && <span>{likes}</span>}
      </button>

      {/* Dislike button */}
      <button
        onClick={() => react('dislike')}
        title="Dislike"
        style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '0.3rem',
          padding:      '0.25rem 0.6rem',
          borderRadius: '999px',
          fontSize:     '0.75rem',
          fontWeight:   600,
          cursor:       'pointer',
          transition:   'all 0.15s',
          border:       `1.5px solid ${iDisliked ? '#ef4444' : 'var(--border)'}`,
          background:   iDisliked ? 'rgba(239,68,68,0.12)' : 'transparent',
          color:        iDisliked ? '#ef4444' : 'var(--muted)',
          transform:    justClicked === 'dislike' ? 'scale(1.15)' : 'scale(1)',
        }}
      >
        <span style={{ fontSize: '0.9rem' }}>👎</span>
        {dislikes > 0 && <span>{dislikes}</span>}
      </button>

      {/* Divider */}
      <div style={{ width: '1px', height: '1.25rem', background: 'var(--border)', margin: '0 0.25rem' }} />

      {/* Emoji reactions */}
      {EMOJI_REACTIONS.map((emoji) => {
        const count   = data.counts[emoji] || 0;
        const isMine  = data.mine.includes(emoji);
        return (
          <button
            key={emoji}
            onClick={() => react(emoji)}
            title={emoji}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '0.25rem',
              padding:      '0.25rem 0.5rem',
              borderRadius: '999px',
              fontSize:     '0.8rem',
              cursor:       'pointer',
              transition:   'all 0.15s',
              border:       `1.5px solid ${isMine ? 'var(--accent)' : 'var(--border)'}`,
              background:   isMine ? 'rgba(59,130,246,0.1)' : 'transparent',
              color:        isMine ? 'var(--accent)' : 'var(--muted)',
              transform:    justClicked === emoji ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            <span>{emoji}</span>
            {count > 0 && (
              <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}