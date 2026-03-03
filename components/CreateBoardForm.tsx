'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateBoardForm() {
  const [name,    setName]    = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    const res  = await fetch('/api/boards', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Failed to create board.');
    } else {
      router.push(`/boards/${data.slug}`);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label style={{ color: 'var(--text)' }} className="block text-sm font-medium mb-2">Board Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rust Beginners, TypeScript Tips"
          maxLength={64}
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
          className="w-full rounded p-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <p style={{ color: 'var(--muted)' }} className="text-xs mt-2">Slug auto-generated. Max 64 chars.</p>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading || !name.trim()}
        style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
        className="w-full py-2.5 rounded text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
      >
        {loading ? 'Creating...' : 'Create Board'}
      </button>
    </div>
  );
}