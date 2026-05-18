'use client';

import { createContext, useCallback, useContext, useState } from 'react';

type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

type ToastContextType = {
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType>({ toasts: [], showToast: () => {}, dismissToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div style={containerStyle}>
      {toasts.map((toast) => (
        <div key={toast.id} style={{ ...toastStyle, ...typeStyles[toast.type] }} onClick={() => onDismiss(toast.id)}>
          <span style={iconStyle}>{typeIcons[toast.type]}</span>
          <span style={msgStyle}>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

const typeIcons: Record<Toast['type'], string> = { success: '✓', error: '✕', info: 'ℹ' };
const typeStyles: Record<Toast['type'], React.CSSProperties> = {
  success: { background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' },
  error: { background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' },
  info: { background: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' },
};

const containerStyle: React.CSSProperties = {
  position: 'fixed', bottom: 24, right: 24, display: 'grid', gap: 8, zIndex: 10000, maxWidth: 360,
};
const toastStyle: React.CSSProperties = {
  padding: '12px 16px', borderRadius: 10, border: '1px solid', display: 'flex', alignItems: 'center', gap: 10,
  cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  animation: 'slideInRight 0.2s ease-out',
};
const iconStyle: React.CSSProperties = { fontSize: '0.9rem', fontWeight: 800 };
const msgStyle: React.CSSProperties = { flex: 1 };
