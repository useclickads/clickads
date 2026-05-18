'use client';

import { useState } from 'react';

type Comment = {
  id: string;
  user: { id: string; name: string };
  text: string;
  blockId?: string;
  createdAt: string;
  resolved: boolean;
};

export function CommentsPanel({ comments, onAddComment, onResolve, selectedBlockId }: {
  comments: Comment[];
  onAddComment: (text: string, blockId?: string) => void;
  onResolve: (id: string) => void;
  selectedBlockId: string | null;
}) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(text.trim(), selectedBlockId || undefined);
    setText('');
  };

  const blockComments = selectedBlockId
    ? comments.filter((c) => c.blockId === selectedBlockId)
    : comments;

  const unresolved = blockComments.filter((c) => !c.resolved);
  const resolved = blockComments.filter((c) => c.resolved);

  return (
    <div style={panelStyle}>
      <h3 style={titleStyle}>
        Comments
        {selectedBlockId && <span style={filterBadge}>Block</span>}
      </h3>

      <form onSubmit={handleSubmit} style={formStyle}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={selectedBlockId ? 'Comment on this block...' : 'Add a comment...'}
          style={textareaStyle}
          rows={2}
        />
        <button type="submit" style={submitBtn} disabled={!text.trim()}>Post</button>
      </form>

      {unresolved.length === 0 && resolved.length === 0 && (
        <p style={emptyText}>No comments yet. Start a discussion!</p>
      )}

      {unresolved.map((c) => (
        <div key={c.id} style={commentCard}>
          <div style={commentHeader}>
            <span style={authorName}>{c.user.name}</span>
            <span style={commentTime}>{new Date(c.createdAt).toLocaleString()}</span>
          </div>
          <p style={commentText}>{c.text}</p>
          {c.blockId && <span style={blockBadge}>Block: {c.blockId.slice(0, 8)}</span>}
          <button onClick={() => onResolve(c.id)} style={resolveBtn}>Resolve</button>
        </div>
      ))}

      {resolved.length > 0 && (
        <>
          <p style={sectionLabel}>Resolved ({resolved.length})</p>
          {resolved.map((c) => (
            <div key={c.id} style={{ ...commentCard, opacity: 0.5 }}>
              <div style={commentHeader}>
                <span style={authorName}>{c.user.name}</span>
              </div>
              <p style={commentText}>{c.text}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

const panelStyle: React.CSSProperties = { padding: 16, overflowY: 'auto', height: '100%' };
const titleStyle: React.CSSProperties = { margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 };
const filterBadge: React.CSSProperties = { padding: '2px 8px', borderRadius: 4, background: '#dbeafe', color: '#2563eb', fontSize: '0.7rem', fontWeight: 600 };
const formStyle: React.CSSProperties = { display: 'grid', gap: 8, marginBottom: 16 };
const textareaStyle: React.CSSProperties = { padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', resize: 'vertical' as const, fontFamily: 'inherit' };
const submitBtn: React.CSSProperties = { padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', justifySelf: 'end' };
const emptyText: React.CSSProperties = { color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: 20 };
const commentCard: React.CSSProperties = { padding: 12, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 8 };
const commentHeader: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 };
const authorName: React.CSSProperties = { fontWeight: 600, fontSize: '0.8rem', color: '#0f172a' };
const commentTime: React.CSSProperties = { fontSize: '0.7rem', color: '#94a3b8' };
const commentText: React.CSSProperties = { margin: '0 0 8px', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 };
const blockBadge: React.CSSProperties = { padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', color: '#64748b', fontSize: '0.7rem', fontWeight: 600 };
const resolveBtn: React.CSSProperties = { marginTop: 4, padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#16a34a', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' };
const sectionLabel: React.CSSProperties = { fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginTop: 16, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.05em' };
