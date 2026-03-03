'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = children.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();

  return (
    <div className="relative group my-4 rounded-md overflow-hidden">
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        style={{ background: 'var(--card)', color: 'var(--muted)', border: '1px solid var(--border)' }}
        className="absolute top-2 right-2 px-2 py-1 rounded text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre style={{ background: '#0d1117', margin: 0 }} className="overflow-x-auto">
        <code
          className={className || ''}
          style={{
            background: 'transparent',
            display: 'table',
            width: '100%',
            padding: '1rem 0',
            fontSize: '0.875rem',
            lineHeight: '1.6',
          }}
        >
          {lines.map((line, i) => (
            <span key={i} style={{ display: 'table-row' }}>
              <span style={{
                display: 'table-cell', textAlign: 'right',
                paddingRight: '1.25em', paddingLeft: '1em',
                color: '#484f58', userSelect: 'none',
                minWidth: '2.5em', borderRight: '1px solid #21262d',
              }}>
                {i + 1}
              </span>
              <span style={{
                display: 'table-cell', paddingLeft: '1em',
                paddingRight: '1em', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              }}>
                {line || ' '}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none" style={{ color: 'var(--text)' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSanitize]}
        components={{
          code({ node, className, children, ...props }: any) {
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return <CodeBlock className={className}>{String(children).replace(/\n$/, '')}</CodeBlock>;
            }
            return (
              <code style={{
                background: 'var(--card)', color: 'var(--accent)',
                padding: '0.1em 0.35em', borderRadius: '3px', fontSize: '0.875em',
              }} {...props}>
                {children}
              </code>
            );
          },
          a({ href, children }: any) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer nofollow" style={{ color: 'var(--accent)' }}>
                {children}
              </a>
            );
          },
          blockquote({ children }: any) {
            return (
              <blockquote style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1rem', marginLeft: 0, opacity: 0.8 }}>
                {children}
              </blockquote>
            );
          },
          table({ children }: any) {
            return (
              <div className="overflow-x-auto my-4">
                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.875rem' }}>{children}</table>
              </div>
            );
          },
          th({ children }: any) {
            return <th style={{ border: '1px solid var(--border)', padding: '0.5rem 0.75rem', background: 'var(--card)', fontWeight: 600, textAlign: 'left' }}>{children}</th>;
          },
          td({ children }: any) {
            return <td style={{ border: '1px solid var(--border)', padding: '0.5rem 0.75rem' }}>{children}</td>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}