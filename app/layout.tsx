import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AnonDev — Anonymous Coder Boards',
  description:
    'Anonymous discussion boards for developers. No login. No tracking.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Theme hydration script */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const theme = localStorage.getItem('theme') || 'light';
              const root = document.documentElement;
              root.classList.remove('dark', 'theme-choc');
              if (theme === 'dark') root.classList.add('dark');
              if (theme === 'choc') root.classList.add('theme-choc');
            } catch(e) {}
          `}
        </Script>

        <ThemeProvider>
          <header
            style={{
              background: 'var(--card)',
              borderBottom: '1px solid var(--border)',
            }}
            className="sticky top-0 z-50 backdrop-blur-sm"
          >
            <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
              <Link
                href="/"
                style={{ color: 'var(--accent)' }}
                className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
              >
                {'<AnonDev />'}
              </Link>

              <div className="flex items-center gap-4">
                <Link
                  href="/new-board"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--accent-fg)',
                  }}
                  className="text-xs px-3 py-1.5 rounded font-medium hover:opacity-90 transition-opacity"
                >
                  + New Board
                </Link>

                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
            {children}
          </main>

          <footer
            style={{
              borderTop: '1px solid var(--border)',
              color: 'var(--muted)',
            }}
            className="text-center text-xs py-6"
          >
            Anonymous. No accounts. No tracking. Just code.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}