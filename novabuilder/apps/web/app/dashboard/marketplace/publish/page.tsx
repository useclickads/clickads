'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../components/protected-route';
import { useApi } from '../../../../lib/use-api';

export default function PublishPluginPage() {
  return (
    <ProtectedRoute>
      <PublishForm />
    </ProtectedRoute>
  );
}

function PublishForm() {
  const api = useApi();
  const router = useRouter();
  const [name, setName] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('utility');
  const [icon, setIcon] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !version.trim()) {
      setError('Name and version are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/marketplace/plugins', {
        name: name.trim(),
        version: version.trim(),
        manifest: {
          description: description.trim() || undefined,
          author: author.trim() || undefined,
          category,
          icon: icon || undefined,
        },
        price: price ? parseFloat(price) : 0,
      });
      router.push('/dashboard/marketplace');
    } catch {
      setError('Failed to publish plugin. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div style={container}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href="/dashboard/marketplace" style={linkStyle}>Marketplace</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Publish</span>
      </nav>

      <h1 style={titleStyle}>Publish a Plugin</h1>
      <p style={muted}>Share your plugin with the NovaBuilder community.</p>

      <form onSubmit={handleSubmit} style={formStyle}>
        {error && <p style={errorStyle}>{error}</p>}

        <label style={labelStyle}>
          Plugin Name *
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="my-awesome-plugin" style={inputStyle} />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <label style={labelStyle}>
            Version *
            <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              <option value="utility">Utility</option>
              <option value="design">Design</option>
              <option value="analytics">Analytics</option>
              <option value="seo">SEO</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="integration">Integration</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <label style={labelStyle}>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what your plugin does..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <label style={labelStyle}>
            Author Name
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your name" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Icon (emoji)
            <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. &nbsp;" style={inputStyle} maxLength={4} />
          </label>
        </div>

        <label style={labelStyle}>
          Price (USD)
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0 for free" min="0" step="0.01" style={inputStyle} />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>Leave blank or 0 for a free plugin.</span>
        </label>

        <button type="submit" disabled={submitting} style={submitBtn}>
          {submitting ? 'Publishing...' : 'Publish Plugin'}
        </button>
      </form>
    </div>
  );
}

const container: React.CSSProperties = { maxWidth: 640, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: '20px 0 0', color: '#0f172a', fontWeight: 800 };
const formStyle: React.CSSProperties = { marginTop: 28, display: 'flex', flexDirection: 'column', gap: 20 };
const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: '#334155' };
const inputStyle: React.CSSProperties = { padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit' };
const submitBtn: React.CSSProperties = { padding: '12px 24px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', alignSelf: 'flex-start' };
const errorStyle: React.CSSProperties = { padding: '10px 14px', borderRadius: 8, background: '#fef2f2', color: '#dc2626', fontSize: '0.85rem', border: '1px solid #fecaca' };
