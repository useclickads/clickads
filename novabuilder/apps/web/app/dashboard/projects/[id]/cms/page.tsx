'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type Field = { id: string; name: string; type: string };
type Collection = { id: string; name: string; slug: string; fields: Field[]; _count?: { cmsentries: number } };
type Entry = { id: string; data: Record<string, unknown>; status: string; createdAt: string };

export default function CmsPage() {
  return (
    <ProtectedRoute>
      <CmsContent />
    </ProtectedRoute>
  );
}

function CmsContent() {
  const { id: projectId } = useParams<{ id: string }>();
  const api = useApi();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCol, setActiveCol] = useState<Collection | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCollections = useCallback(async () => {
    try {
      const data = await api.get<Collection[]>(`/projects/${projectId}/cms/collections`);
      setCollections(data);
    } catch {}
    setLoading(false);
  }, [api, projectId]);

  useEffect(() => { loadCollections(); }, [loadCollections]);

  const loadEntries = useCallback(async (col: Collection) => {
    setActiveCol(col);
    try {
      const data = await api.get<Entry[]>(`/projects/${projectId}/cms/collections/${col.id}/entries`);
      setEntries(data);
    } catch { setEntries([]); }
  }, [api, projectId]);

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href={`/dashboard/projects/${projectId}`} style={linkStyle}>← Project</Link>
        <span style={{ color: '#94a3b8' }}>/</span>
        <span style={{ fontWeight: 600, color: '#0f172a' }}>CMS</span>
      </nav>

      <div style={layoutStyle}>
        <aside style={sidebarStyle}>
          <div style={sidebarHeader}>
            <h3 style={sidebarTitle}>Collections</h3>
            <button onClick={() => setShowCreate(true)} style={addBtn}>+</button>
          </div>
          {showCreate && <CreateCollectionForm api={api} projectId={projectId} onCreated={() => { setShowCreate(false); loadCollections(); }} onCancel={() => setShowCreate(false)} />}
          {collections.map((col) => (
            <button key={col.id} onClick={() => loadEntries(col)} style={activeCol?.id === col.id ? activeItem : sideItem}>
              <span>{col.name}</span>
              <span style={countBadge}>{col._count?.cmsentries ?? 0}</span>
            </button>
          ))}
          {!loading && collections.length === 0 && <p style={muted}>No collections yet.</p>}
        </aside>

        <main style={mainStyle}>
          {!activeCol ? (
            <div style={emptyMain}><p style={muted}>Select a collection to view entries</p></div>
          ) : (
            <CollectionView
              collection={activeCol}
              entries={entries}
              api={api}
              projectId={projectId}
              onRefresh={() => loadEntries(activeCol)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function CreateCollectionForm({ api, projectId, onCreated, onCancel }: { api: any; projectId: string; onCreated: () => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(v: string) {
    setName(v);
    setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post(`/projects/${projectId}/cms/collections`, { name, slug });
      onCreated();
    } catch (err: any) { setError(err.message); }
  }

  return (
    <form onSubmit={handleSubmit} style={miniForm}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => handleNameChange(e.target.value)} required style={miniInput} />
      <input type="text" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required style={miniInput} />
      {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '0.75rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="submit" style={miniBtn}>Create</button>
        <button type="button" onClick={onCancel} style={miniCancelBtn}>Cancel</button>
      </div>
    </form>
  );
}

function CollectionView({ collection, entries, api, projectId, onRefresh }: { collection: Collection; entries: Entry[]; api: any; projectId: string; onRefresh: () => void }) {
  const [showAddField, setShowAddField] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);

  return (
    <div>
      <div style={colHeader}>
        <div>
          <h2 style={colTitle}>{collection.name}</h2>
          <p style={muted}>/{collection.slug} — {collection.fields.length} fields, {entries.length} entries</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowAddField(true)} style={secondaryBtn}>Add Field</button>
          <button onClick={() => setShowAddEntry(true)} style={primaryBtn}>New Entry</button>
        </div>
      </div>

      {showAddField && (
        <AddFieldForm api={api} projectId={projectId} collectionId={collection.id} onCreated={() => { setShowAddField(false); onRefresh(); }} onCancel={() => setShowAddField(false)} />
      )}

      {collection.fields.length > 0 && (
        <div style={fieldsRow}>
          {collection.fields.map((f) => (
            <span key={f.id} style={fieldChip}>{f.name} <span style={{ color: '#94a3b8' }}>({f.type})</span></span>
          ))}
        </div>
      )}

      {showAddEntry && (
        <AddEntryForm fields={collection.fields} api={api} projectId={projectId} collectionId={collection.id} onCreated={() => { setShowAddEntry(false); onRefresh(); }} onCancel={() => setShowAddEntry(false)} />
      )}

      {entries.length === 0 ? (
        <div style={emptyMain}><p style={muted}>No entries yet.</p></div>
      ) : (
        <div style={entriesList}>
          {entries.map((entry) => (
            <div key={entry.id} style={entryRow}>
              <div style={{ flex: 1 }}>
                {collection.fields.slice(0, 3).map((f) => (
                  <span key={f.id} style={entryField}>{String(entry.data[f.name] ?? '—')}</span>
                ))}
              </div>
              <span style={statusBadge(entry.status)}>{entry.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddFieldForm({ api, projectId, collectionId, onCreated, onCancel }: { api: any; projectId: string; collectionId: string; onCreated: () => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.post(`/projects/${projectId}/cms/collections/${collectionId}/fields`, { name, type });
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} style={miniForm}>
      <input type="text" placeholder="Field name" value={name} onChange={(e) => setName(e.target.value)} required style={miniInput} />
      <select value={type} onChange={(e) => setType(e.target.value)} style={miniInput}>
        <option value="text">Text</option>
        <option value="richtext">Rich Text</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
        <option value="date">Date</option>
        <option value="image">Image</option>
        <option value="url">URL</option>
        <option value="email">Email</option>
        <option value="json">JSON</option>
      </select>
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="submit" style={miniBtn}>Add</button>
        <button type="button" onClick={onCancel} style={miniCancelBtn}>Cancel</button>
      </div>
    </form>
  );
}

function AddEntryForm({ fields, api, projectId, collectionId, onCreated, onCancel }: { fields: Field[]; api: any; projectId: string; collectionId: string; onCreated: () => void; onCancel: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.post(`/projects/${projectId}/cms/collections/${collectionId}/entries`, { data: values });
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} style={{ ...miniForm, marginTop: 16 }}>
      {fields.map((f) => (
        <label key={f.id} style={{ display: 'grid', gap: 4, fontSize: '0.8rem', color: '#334155' }}>
          {f.name}
          <input type="text" value={values[f.name] || ''} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))} style={miniInput} />
        </label>
      ))}
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="submit" style={miniBtn}>Create Entry</button>
        <button type="button" onClick={onCancel} style={miniCancelBtn}>Cancel</button>
      </div>
    </form>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem', marginBottom: 24 };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const layoutStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, minHeight: 500 };
const sidebarStyle: React.CSSProperties = { background: '#f8fafc', borderRadius: 14, padding: 16, border: '1px solid #e2e8f0' };
const sidebarHeader: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 };
const sidebarTitle: React.CSSProperties = { margin: 0, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' };
const addBtn: React.CSSProperties = { width: 24, height: 24, borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 700 };
const sideItem: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', color: '#334155', textAlign: 'left' };
const activeItem: React.CSSProperties = { ...sideItem, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' };
const countBadge: React.CSSProperties = { fontSize: '0.7rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: 4, color: '#64748b' };
const mainStyle: React.CSSProperties = { minHeight: 400 };
const emptyMain: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 };
const muted: React.CSSProperties = { color: '#94a3b8', fontSize: '0.85rem' };
const colHeader: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const colTitle: React.CSSProperties = { margin: 0, fontSize: '1.2rem', color: '#0f172a' };
const primaryBtn: React.CSSProperties = { padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' };
const secondaryBtn: React.CSSProperties = { padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' };
const miniForm: React.CSSProperties = { display: 'grid', gap: 8, padding: 12, background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', marginTop: 8 };
const miniInput: React.CSSProperties = { padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: '0.8rem' };
const miniBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 6, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem' };
const miniCancelBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem' };
const fieldsRow: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 };
const fieldChip: React.CSSProperties = { padding: '4px 10px', borderRadius: 6, background: '#f1f5f9', fontSize: '0.75rem', fontWeight: 600, color: '#334155' };
const entriesList: React.CSSProperties = { marginTop: 20, display: 'grid', gap: 8 };
const entryRow: React.CSSProperties = { padding: 14, borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16 };
const entryField: React.CSSProperties = { marginRight: 16, fontSize: '0.85rem', color: '#1e293b' };
const statusBadge = (status: string): React.CSSProperties => ({ padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600, background: status === 'published' ? '#dcfce7' : '#f1f5f9', color: status === 'published' ? '#16a34a' : '#64748b' });
