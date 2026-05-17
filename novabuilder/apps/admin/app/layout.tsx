import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NovaBuilder Admin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, display: 'flex', minHeight: '100vh' }}>
        <aside style={sidebarStyle}>
          <h2 style={logoStyle}>Nova Admin</h2>
          <nav style={navStyle}>
            <a href="/" style={navLink}>Dashboard</a>
            <a href="/users" style={navLink}>Users</a>
            <a href="/projects" style={navLink}>Projects</a>
            <a href="/activity" style={navLink}>Activity</a>
          </nav>
        </aside>
        <main style={mainStyle}>{children}</main>
      </body>
    </html>
  );
}

const sidebarStyle: React.CSSProperties = { width: 220, background: '#0f172a', color: '#fff', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24, flexShrink: 0 };
const logoStyle: React.CSSProperties = { margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff' };
const navStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 };
const navLink: React.CSSProperties = { color: '#94a3b8', textDecoration: 'none', padding: '10px 12px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 500 };
const mainStyle: React.CSSProperties = { flex: 1, padding: '32px 40px', background: '#f8fafc', overflow: 'auto' };
