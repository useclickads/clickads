'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type SearchResult = {
  type: 'project' | 'page' | 'collection' | 'action';
  id: string;
  title: string;
  subtitle?: string;
  projectId?: string;
  action?: () => void;
};

const ACTIONS: SearchResult[] = [
  { type: 'action', id: 'new-project', title: 'New Project', subtitle: 'Create a new project' },
  { type: 'action', id: 'new-page', title: 'New Page', subtitle: 'Add a page to current project' },
  { type: 'action', id: 'settings', title: 'Settings', subtitle: 'Project settings' },
  { type: 'action', id: 'deploy', title: 'Deploy', subtitle: 'Deploy current project' },
  { type: 'action', id: 'export', title: 'Export Project', subtitle: 'Export as JSON' },
  { type: 'action', id: 'templates', title: 'Browse Templates', subtitle: 'Start from a template' },
];

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(ACTIONS);
      return;
    }

    const lq = q.toLowerCase();
    const actionResults = ACTIONS.filter(
      (a) => a.title.toLowerCase().includes(lq) || a.subtitle?.toLowerCase().includes(lq),
    );

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        const apiResults: SearchResult[] = [
          ...(data.projects || []).map((p: any) => ({ ...p, type: 'project' as const })),
          ...(data.pages || []).map((p: any) => ({ ...p, type: 'page' as const })),
          ...(data.collections || []).map((c: any) => ({ ...c, type: 'collection' as const })),
        ];
        setResults([...actionResults, ...apiResults]);
      } else {
        setResults(actionResults);
      }
    } catch {
      setResults(actionResults);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  }

  function handleSelect(result: SearchResult) {
    onClose();
    if (result.action) {
      result.action();
      return;
    }
    switch (result.type) {
      case 'project':
        router.push(`/dashboard/projects/${result.id}`);
        break;
      case 'page':
        if (result.projectId) router.push(`/editor/${result.projectId}?page=${result.id}`);
        break;
      case 'collection':
        if (result.projectId) router.push(`/dashboard/projects/${result.projectId}/cms`);
        break;
      case 'action':
        if (result.id === 'new-project') router.push('/dashboard/projects?new=true');
        else if (result.id === 'templates') router.push('/dashboard/marketplace');
        else if (result.id === 'settings') router.push('/dashboard');
        break;
    }
  }

  const typeIcon: Record<string, string> = {
    project: 'P', page: '⊟', collection: 'C', action: '⌘',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={paletteStyle} onClick={(e) => e.stopPropagation()}>
        <div style={searchRow}>
          <span style={searchIcon}>⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, pages, or type a command..."
            style={searchInput}
          />
          {loading && <span style={spinner}>⟳</span>}
          <kbd style={escBadge}>ESC</kbd>
        </div>

        <div style={resultsList}>
          {results.length === 0 && query && (
            <div style={emptyRow}>No results for "{query}"</div>
          )}
          {results.map((result, i) => (
            <div
              key={`${result.type}-${result.id}`}
              style={{
                ...resultRow,
                background: i === selectedIndex ? '#f1f5f9' : 'transparent',
              }}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span style={iconBadge}>{typeIcon[result.type]}</span>
              <div style={{ flex: 1 }}>
                <div style={resultTitle}>{result.title}</div>
                {result.subtitle && <div style={resultSub}>{result.subtitle}</div>}
              </div>
              <span style={typeBadge}>{result.type}</span>
            </div>
          ))}
        </div>

        <div style={footerStyle}>
          <span><kbd style={kbdStyle}>↑↓</kbd> navigate</span>
          <span><kbd style={kbdStyle}>↵</kbd> select</span>
          <span><kbd style={kbdStyle}>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return { open, setOpen };
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
  zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh',
};
const paletteStyle: React.CSSProperties = {
  width: 560, maxHeight: '60vh', background: '#fff', borderRadius: 16,
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
};
const searchRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
  borderBottom: '1px solid #e2e8f0',
};
const searchIcon: React.CSSProperties = { fontSize: '1rem', color: '#94a3b8', fontWeight: 700 };
const searchInput: React.CSSProperties = {
  flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', color: '#0f172a',
  background: 'transparent', fontFamily: 'inherit',
};
const spinner: React.CSSProperties = { color: '#94a3b8', animation: 'spin 1s linear infinite' };
const escBadge: React.CSSProperties = {
  padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', color: '#64748b',
  fontSize: '0.65rem', fontFamily: 'monospace',
};
const resultsList: React.CSSProperties = { flex: 1, overflow: 'auto', padding: '4px 0' };
const emptyRow: React.CSSProperties = { padding: '20px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' };
const resultRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px',
  cursor: 'pointer', transition: 'background 0.1s',
};
const iconBadge: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 6, background: '#f1f5f9', display: 'flex',
  alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800,
  color: '#64748b', flexShrink: 0,
};
const resultTitle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 500, color: '#1e293b' };
const resultSub: React.CSSProperties = { fontSize: '0.7rem', color: '#94a3b8' };
const typeBadge: React.CSSProperties = {
  fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em',
};
const footerStyle: React.CSSProperties = {
  display: 'flex', gap: 16, padding: '10px 16px', borderTop: '1px solid #e2e8f0',
  fontSize: '0.7rem', color: '#94a3b8',
};
const kbdStyle: React.CSSProperties = {
  padding: '1px 4px', borderRadius: 3, background: '#f1f5f9', fontFamily: 'monospace', fontSize: '0.65rem',
};
