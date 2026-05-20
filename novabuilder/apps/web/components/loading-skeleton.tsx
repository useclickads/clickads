'use client';

export function Skeleton({ width, height, borderRadius = 8 }: { width?: string | number; height?: string | number; borderRadius?: number }) {
  return (
    <div
      style={{
        width: width || '100%',
        height: height || 16,
        borderRadius,
        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div style={cardStyle}>
      <Skeleton height={14} width="40%" />
      <Skeleton height={24} width="60%" />
      <Skeleton height={10} width="80%" />
      <Skeleton height={6} borderRadius={3} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={tableStyle}>
      <div style={headerRow}>
        <Skeleton height={12} width="15%" />
        <Skeleton height={12} width="25%" />
        <Skeleton height={12} width="20%" />
        <Skeleton height={12} width="10%" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={tableRow}>
          <Skeleton height={14} width="15%" />
          <Skeleton height={14} width="30%" />
          <Skeleton height={14} width="20%" />
          <Skeleton height={14} width="8%" />
        </div>
      ))}
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div style={projectCard}>
      <Skeleton height={140} borderRadius={12} />
      <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton height={16} width="65%" />
        <Skeleton height={12} width="40%" />
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <Skeleton height={24} width={60} borderRadius={12} />
          <Skeleton height={24} width={80} borderRadius={12} />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div style={dashboardStyle}>
      <div style={headerSkel}>
        <Skeleton height={28} width={200} />
        <Skeleton height={36} width={120} borderRadius={10} />
      </div>
      <div style={statsGrid}>
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
      <div style={projectsGrid}>
        {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
      </div>
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div style={editorLayout}>
      <div style={sidebarSkel}>
        <Skeleton height={20} width="60%" />
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={32} borderRadius={6} />
          ))}
        </div>
      </div>
      <div style={canvasSkel}>
        <Skeleton height="100%" borderRadius={0} />
      </div>
      <div style={propsSkel}>
        <Skeleton height={16} width="50%" />
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Skeleton height={10} width="30%" />
              <Skeleton height={32} borderRadius={6} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ShimmerStyle() {
  return (
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  );
}

const cardStyle: React.CSSProperties = {
  padding: 20, borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0',
  display: 'flex', flexDirection: 'column', gap: 10,
};
const tableStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 1 };
const headerRow: React.CSSProperties = {
  display: 'flex', gap: 16, padding: '12px 16px', background: '#f8fafc', borderRadius: '8px 8px 0 0',
};
const tableRow: React.CSSProperties = {
  display: 'flex', gap: 16, padding: '14px 16px', background: '#fff',
  borderBottom: '1px solid #f1f5f9',
};
const projectCard: React.CSSProperties = {
  borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid #e2e8f0',
  padding: 12,
};
const dashboardStyle: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '40px 24px' };
const headerSkel: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 };
const statsGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 };
const projectsGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 };
const editorLayout: React.CSSProperties = { display: 'grid', gridTemplateColumns: '240px 1fr 280px', height: '100vh' };
const sidebarSkel: React.CSSProperties = { padding: 16, borderRight: '1px solid #e2e8f0', background: '#fff' };
const canvasSkel: React.CSSProperties = { background: '#f8fafc', padding: 0 };
const propsSkel: React.CSSProperties = { padding: 16, borderLeft: '1px solid #e2e8f0', background: '#fff' };
