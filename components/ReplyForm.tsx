'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReplyForm({ threadId, boardSlug }: { threadId: string; boardSlug?: string }) {
  const [content, setContent] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/posts', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ threadId, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to post.');
      } else {
        setContent('');
        router.refresh();
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)' }} className="rounded-lg p-5">
      <h3 style={{ color: 'var(--text)' }} className="text-sm font-semibold mb-3">Post a Reply</h3>
      <p style={{ color: 'var(--muted)' }} className="text-xs mb-3">Markdown supported. Use ``` for code blocks.</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reply..."
        rows={6}
        maxLength={10000}
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
        className="w-full rounded p-3 text-sm font-mono resize-y focus:outline-none focus:border-[var(--accent)] transition-colors"
      />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      <div className="flex items-center justify-between mt-3">
        <span style={{ color: 'var(--muted)' }} className="text-xs">{content.length}/10000 · 1 post per 20s</span>
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
          className="px-4 py-2 rounded text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          {loading ? 'Posting...' : 'Post Reply'}
        </button>
      </div>
    </div>
  );
}