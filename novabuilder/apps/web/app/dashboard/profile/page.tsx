'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/protected-route';
import { useApi } from '../../../lib/use-api';

type Profile = { id: string; email: string; name: string | null; avatarUrl: string | null; createdAt: string };

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileSettings />
    </ProtectedRoute>
  );
}

function ProfileSettings() {
  const api = useApi();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const load = useCallback(async () => {
    try {
      const data = await api.get<Profile>('/users/profile');
      setProfile(data);
      setName(data.name || '');
      setAvatarUrl(data.avatarUrl || '');
    } catch {}
  }, [api]);

  useEffect(() => { load(); }, [load]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.patch('/users/profile', { name, avatarUrl: avatarUrl || undefined });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  }

  if (!profile) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Profile</span>
      </nav>

      <h1 style={titleStyle}>Account Settings</h1>

      <div style={tabBar}>
        <button onClick={() => setActiveTab('profile')} style={tabBtn(activeTab === 'profile')}>Profile</button>
        <button onClick={() => setActiveTab('password')} style={tabBtn(activeTab === 'password')}>Password</button>
      </div>

      {activeTab === 'profile' ? (
        <form onSubmit={handleSaveProfile} style={sectionStyle}>
          <label style={labelStyle}>
            Email
            <input type="email" value={profile.email} disabled style={{ ...inputStyle, background: '#f1f5f9', color: '#64748b' }} />
          </label>
          <label style={labelStyle}>
            Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Your name" />
          </label>
          <label style={labelStyle}>
            Avatar URL
            <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} style={inputStyle} placeholder="https://example.com/avatar.png" />
          </label>
          {avatarUrl && <img src={avatarUrl} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />}
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
          <button type="submit" style={saveBtn} disabled={saving}>{saving ? 'Saving…' : saved ? 'Saved!' : 'Save Profile'}</button>
        </form>
      ) : (
        <ChangePasswordForm api={api} />
      )}
    </div>
  );
}

function ChangePasswordForm({ api }: { api: ReturnType<typeof useApi> }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirm) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const res = await api.post<{ ok?: boolean; error?: string }>('/users/change-password', { currentPassword, newPassword });
      if (res.error) { setError(res.error); }
      else { setSuccess(true); setCurrentPassword(''); setNewPassword(''); setConfirm(''); }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={sectionStyle}>
      <label style={labelStyle}>
        Current Password
        <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        New Password
        <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} minLength={8} />
      </label>
      <label style={labelStyle}>
        Confirm New Password
        <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} style={inputStyle} />
      </label>
      {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '0.85rem' }}>{error}</p>}
      {success && <p style={{ margin: 0, color: '#16a34a', fontSize: '0.85rem' }}>Password changed successfully.</p>}
      <button type="submit" style={saveBtn} disabled={loading}>{loading ? 'Changing…' : 'Change Password'}</button>
    </form>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 600, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: '20px 0 0', color: '#0f172a' };
const tabBar: React.CSSProperties = { display: 'flex', gap: 0, marginTop: 24, borderBottom: '1px solid #e2e8f0' };
const tabBtn = (active: boolean): React.CSSProperties => ({ padding: '12px 20px', border: 'none', background: 'transparent', color: active ? '#0f172a' : '#64748b', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', borderBottom: active ? '2px solid #2563eb' : '2px solid transparent' });
const sectionStyle: React.CSSProperties = { marginTop: 24, display: 'grid', gap: 16 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 6, color: '#334155', fontSize: '0.9rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.95rem' };
const saveBtn: React.CSSProperties = { padding: '10px 20px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', justifySelf: 'start' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
