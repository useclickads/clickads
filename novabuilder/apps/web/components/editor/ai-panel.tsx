'use client';

import { useState } from 'react';
import { useApi } from '../../lib/use-api';
import { useEditor } from '../../lib/editor/editor-context';

type Block = { id: string; type: string; props: Record<string, unknown> };

export function AiPanel() {
  const api = useApi();
  const { state, setBlocks } = useEditor();
  const blocks = state.blocks;
  const [prompt, setPrompt] = useState('');
  const [copyType, setCopyType] = useState<'headline' | 'paragraph' | 'cta' | 'tagline'>('headline');
  const [topic, setTopic] = useState('');
  const [suggestions, setSuggestions] = useState<Block[]>([]);
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'suggest' | 'copy' | 'generate'>('suggest');

  async function handleSuggest() {
    setLoading(true);
    try {
      const data = await api.post<Block[]>('/ai/suggest-blocks', { existingBlocks: blocks, prompt });
      setSuggestions(data);
    } catch {}
    setLoading(false);
  }

  async function handleGenerateCopy() {
    setLoading(true);
    try {
      const data = await api.post<{ text: string }>('/ai/generate-copy', { type: copyType, topic });
      setGeneratedCopy(data.text);
    } catch {}
    setLoading(false);
  }

  async function handleGeneratePage() {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const data = await api.post<{ blocks: Block[] }>('/ai/generate-page', { prompt });
      setBlocks([...blocks, ...data.blocks] as any);
    } catch {}
    setLoading(false);
  }

  function handleAddSuggestion(block: Block) {
    setBlocks([...blocks, block] as any);
    setSuggestions((prev) => prev.filter((s) => s.id !== block.id));
  }

  return (
    <div style={panelStyle}>
      <div style={tabRow}>
        <button onClick={() => setTab('suggest')} style={tab === 'suggest' ? tabActive : tabBtn}>Suggest</button>
        <button onClick={() => setTab('copy')} style={tab === 'copy' ? tabActive : tabBtn}>Copy</button>
        <button onClick={() => setTab('generate')} style={tab === 'generate' ? tabActive : tabBtn}>Generate</button>
      </div>

      {tab === 'suggest' && (
        <div style={sectionStyle}>
          <p style={descText}>Get smart block suggestions based on your current page.</p>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What is this page about?"
            style={inputStyle}
          />
          <button onClick={handleSuggest} style={primaryBtn} disabled={loading}>
            {loading ? 'Thinking...' : 'Get Suggestions'}
          </button>
          {suggestions.length > 0 && (
            <div style={suggestList}>
              {suggestions.map((s) => (
                <div key={s.id} style={suggestCard}>
                  <div>
                    <span style={blockType}>{s.type}</span>
                    <p style={blockPreview}>{previewText(s)}</p>
                  </div>
                  <button onClick={() => handleAddSuggestion(s)} style={addBtn}>+ Add</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'copy' && (
        <div style={sectionStyle}>
          <p style={descText}>Generate copy for your blocks.</p>
          <select value={copyType} onChange={(e) => setCopyType(e.target.value as typeof copyType)} style={inputStyle}>
            <option value="headline">Headline</option>
            <option value="paragraph">Paragraph</option>
            <option value="cta">Call to Action</option>
            <option value="tagline">Tagline</option>
          </select>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (optional)"
            style={inputStyle}
          />
          <button onClick={handleGenerateCopy} style={primaryBtn} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Copy'}
          </button>
          {generatedCopy && (
            <div style={resultCard}>
              <p style={resultText}>{generatedCopy}</p>
              <button onClick={() => navigator.clipboard.writeText(generatedCopy)} style={copyBtn}>Copy</button>
            </div>
          )}
        </div>
      )}

      {tab === 'generate' && (
        <div style={sectionStyle}>
          <p style={descText}>Describe a page and AI will generate blocks for you.</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A SaaS landing page with hero, features, pricing, and contact form"
            style={textareaStyle}
            rows={4}
          />
          <button onClick={handleGeneratePage} style={primaryBtn} disabled={loading || !prompt.trim()}>
            {loading ? 'Generating...' : 'Generate Page'}
          </button>
        </div>
      )}
    </div>
  );
}

function previewText(block: Block): string {
  const p = block.props;
  if (p.title) return String(p.title);
  if (p.content) return String(p.content).slice(0, 60);
  if (p.text) return String(p.text);
  return block.type;
}

const panelStyle: React.CSSProperties = { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 };
const tabRow: React.CSSProperties = { display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 };
const tabBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 6, border: 'none', background: 'transparent', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const tabActive: React.CSSProperties = { ...tabBtn, background: '#0f172a', color: '#fff' };
const sectionStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10 };
const descText: React.CSSProperties = { margin: 0, fontSize: '0.8rem', color: '#64748b' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' };
const textareaStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', resize: 'vertical' };
const primaryBtn: React.CSSProperties = { padding: '8px 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' };
const suggestList: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 };
const suggestCard: React.CSSProperties = { padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 };
const blockType: React.CSSProperties = { fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' };
const blockPreview: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.8rem', color: '#475569' };
const addBtn: React.CSSProperties = { padding: '4px 10px', borderRadius: 6, border: '1px solid #2563eb', background: '#fff', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' };
const resultCard: React.CSSProperties = { padding: 12, borderRadius: 8, background: '#f0f9ff', border: '1px solid #bfdbfe' };
const resultText: React.CSSProperties = { margin: 0, fontSize: '0.85rem', color: '#1e40af', lineHeight: 1.5 };
const copyBtn: React.CSSProperties = { marginTop: 8, padding: '4px 10px', borderRadius: 6, border: '1px solid #bfdbfe', background: '#fff', color: '#2563eb', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
