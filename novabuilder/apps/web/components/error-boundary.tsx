'use client';

import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={containerStyle}>
          <div style={cardStyle}>
            <div style={iconCircle}>!</div>
            <h2 style={titleStyle}>Something went wrong</h2>
            <p style={messageStyle}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <div style={actions}>
              <button onClick={this.handleRetry} style={primaryBtn}>Try Again</button>
              <button onClick={() => window.location.reload()} style={secondaryBtn}>Reload Page</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function NotFoundPage() {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={code404}>404</h1>
        <h2 style={titleStyle}>Page not found</h2>
        <p style={messageStyle}>The page you're looking for doesn't exist or has been moved.</p>
        <div style={actions}>
          <a href="/dashboard" style={primaryLink}>Go to Dashboard</a>
          <button onClick={() => window.history.back()} style={secondaryBtn}>Go Back</button>
        </div>
      </div>
    </div>
  );
}

export function ServerErrorPage() {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconCircle}>!</div>
        <h2 style={titleStyle}>Server Error</h2>
        <p style={messageStyle}>Something went wrong on our end. Please try again later.</p>
        <div style={actions}>
          <button onClick={() => window.location.reload()} style={primaryBtn}>Reload Page</button>
          <a href="/dashboard" style={secondaryLink}>Go to Dashboard</a>
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#f8fafc', padding: 24,
};
const cardStyle: React.CSSProperties = {
  maxWidth: 440, textAlign: 'center', padding: 48, borderRadius: 20,
  background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
};
const iconCircle: React.CSSProperties = {
  width: 56, height: 56, borderRadius: 28, background: '#fef2f2', color: '#dc2626',
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
  fontWeight: 800, margin: '0 auto 16px',
};
const code404: React.CSSProperties = {
  margin: '0 0 8px', fontSize: '4rem', fontWeight: 900, color: '#e2e8f0',
  lineHeight: 1,
};
const titleStyle: React.CSSProperties = { margin: '0 0 8px', fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 };
const messageStyle: React.CSSProperties = { margin: '0 0 24px', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 };
const actions: React.CSSProperties = { display: 'flex', gap: 10, justifyContent: 'center' };
const primaryBtn: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 10, border: 'none', background: '#0f172a',
  color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
};
const secondaryBtn: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 10, border: '1px solid #e2e8f0',
  background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
};
const primaryLink: React.CSSProperties = { ...primaryBtn, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' };
const secondaryLink: React.CSSProperties = { ...secondaryBtn, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' };
