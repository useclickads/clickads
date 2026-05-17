'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/providers';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !user) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#64748b' }}>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
