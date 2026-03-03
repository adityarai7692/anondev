'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateThreadForm({ boardSlug }: { boardSlug: string }) {
  const [title,   setTitle]   = useState('');
  const [content, setContent] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError('');
    const res  = await fetch('/api/threads', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ title, content, boardSlug }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Failed to create thread.');
    } else {
      router.push(`/thread/${data.threadId}`);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label style={{ color: 'var(--text)' }} className="block text-sm font-medium mb-2">Thread Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's this thread about?"
          maxLength={200}
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
          className="w-full rounded p-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>
      <div>
        <label style={{ color: 'var(--text)' }} className="block text-sm font-medium mb-2">Opening Post</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post... Markdown + code blocks supported."
          rows={8}
          maxLength={10000}
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
          className="w-full rounded p-3 text-sm font-mono resize-y focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading || !title.trim() || !content.trim()}
        style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
        className="w-full py-2.5 rounded text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
      >
        {loading ? 'Creating...' : 'Create Thread'}
      </button>
    </div>
  );
}