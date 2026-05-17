'use client';

import type { Block } from '../../lib/editor/types';

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock props={block.props} />;
    case 'text':
      return <TextBlock props={block.props} />;
    case 'image':
      return <ImageBlock props={block.props} />;
    case 'button':
      return <ButtonBlock props={block.props} />;
    case 'columns':
      return <ColumnsBlock props={block.props} />;
    case 'spacer':
      return <SpacerBlock props={block.props} />;
    case 'card':
      return <CardBlock props={block.props} />;
    case 'navigation':
      return <NavigationBlock props={block.props} />;
    case 'footer':
      return <FooterBlock props={block.props} />;
    case 'form':
      return <FormBlock props={block.props} />;
    case 'video':
      return <VideoBlock props={block.props} />;
    default:
      return <div style={{ padding: 16, background: '#fef3c7', borderRadius: 8 }}>Unknown block type</div>;
  }
}

function HeroBlock({ props }: { props: Record<string, unknown> }) {
  const align = (props.align as string) || 'center';
  return (
    <div style={{ padding: '64px 32px', textAlign: align as any, background: props.backgroundUrl ? `url(${props.backgroundUrl}) center/cover` : 'linear-gradient(135deg, #0f172a, #1e40af)', borderRadius: 12 }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#fff', fontWeight: 800 }}>{props.heading as string}</h1>
      <p style={{ marginTop: 12, fontSize: '1.1rem', color: '#cbd5e1' }}>{props.subheading as string}</p>
      {props.buttonText ? (
        <a href={props.buttonUrl as string} style={{ display: 'inline-block', marginTop: 24, padding: '14px 28px', background: '#fff', color: '#0f172a', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>
          {props.buttonText as string}
        </a>
      ) : null}
    </div>
  );
}

function TextBlock({ props }: { props: Record<string, unknown> }) {
  return (
    <div style={{ padding: '12px 0', fontSize: props.fontSize as string, color: props.color as string, textAlign: (props.align as any) || 'left', lineHeight: 1.7 }}>
      {props.content as string}
    </div>
  );
}

function ImageBlock({ props }: { props: Record<string, unknown> }) {
  const src = props.src as string;
  if (!src) {
    return <div style={{ padding: 32, background: '#f1f5f9', borderRadius: props.borderRadius as string, textAlign: 'center', color: '#94a3b8' }}>No image selected</div>;
  }
  return <img src={src} alt={props.alt as string} style={{ width: props.width as string, height: props.height as string, borderRadius: props.borderRadius as string, display: 'block' }} />;
}

function ButtonBlock({ props }: { props: Record<string, unknown> }) {
  const variant = props.variant as string;
  const size = props.size as string;
  const padding = size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px';
  const bg = variant === 'primary' ? '#0f172a' : variant === 'secondary' ? '#e2e8f0' : 'transparent';
  const color = variant === 'primary' ? '#fff' : '#0f172a';
  const border = variant === 'outline' ? '2px solid #0f172a' : 'none';
  return (
    <div style={{ textAlign: (props.align as any) || 'left' }}>
      <a href={props.url as string} style={{ display: 'inline-block', padding, background: bg, color, border, borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
        {props.text as string}
      </a>
    </div>
  );
}

function ColumnsBlock({ props }: { props: Record<string, unknown> }) {
  const cols = Number(props.columns) || 2;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: props.gap as string, padding: '12px 0' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} style={{ padding: 24, background: '#f8fafc', borderRadius: 10, border: '1px dashed #cbd5e1', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
          Column {i + 1}
        </div>
      ))}
    </div>
  );
}

function SpacerBlock({ props }: { props: Record<string, unknown> }) {
  return <div style={{ height: props.height as string }} />;
}

function CardBlock({ props }: { props: Record<string, unknown> }) {
  return (
    <div style={{ padding: 24, borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0', maxWidth: 400 }}>
      {props.imageUrl ? <img src={props.imageUrl as string} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 16 }} /> : null}
      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{props.title as string}</h3>
      <p style={{ marginTop: 8, color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>{props.description as string}</p>
      {props.linkText ? (
        <a href={props.linkUrl as string} style={{ display: 'inline-block', marginTop: 12, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
          {String(props.linkText)} →
        </a>
      ) : null}
    </div>
  );
}

function NavigationBlock({ props }: { props: Record<string, unknown> }) {
  let links: { label: string; url: string }[] = [];
  try { links = JSON.parse(props.links as string); } catch {}
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{props.brand as string}</span>
      <div style={{ display: 'flex', gap: 24 }}>
        {links.map((link, i) => (
          <a key={i} href={link.url} style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{link.label}</a>
        ))}
      </div>
    </nav>
  );
}

function FooterBlock({ props }: { props: Record<string, unknown> }) {
  let links: { label: string; url: string }[] = [];
  try { links = JSON.parse(props.links as string); } catch {}
  return (
    <footer style={{ padding: '24px 32px', background: '#f8fafc', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{props.text as string}</span>
      <div style={{ display: 'flex', gap: 16 }}>
        {links.map((link, i) => (
          <a key={i} href={link.url} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>{link.label}</a>
        ))}
      </div>
    </footer>
  );
}

function FormBlock({ props }: { props: Record<string, unknown> }) {
  let fields: { name: string; type: string; label: string; required: boolean }[] = [];
  try { fields = JSON.parse(props.fields as string); } catch {}
  return (
    <div style={{ padding: 24, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 16px', color: '#0f172a' }}>{props.heading as string}</h3>
      <div style={{ display: 'grid', gap: 12 }}>
        {fields.map((field) => (
          <label key={field.name} style={{ display: 'grid', gap: 4, fontSize: '0.85rem', color: '#334155' }}>
            {field.label}{field.required && ' *'}
            {field.type === 'textarea' ? (
              <textarea style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', resize: 'vertical', minHeight: 80 }} />
            ) : (
              <input type={field.type} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }} />
            )}
          </label>
        ))}
        <button type="button" style={{ padding: '12px 20px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', justifySelf: 'start' }}>
          {props.submitText as string}
        </button>
      </div>
    </div>
  );
}

function VideoBlock({ props }: { props: Record<string, unknown> }) {
  const url = props.url as string;
  if (!url) {
    return <div style={{ aspectRatio: props.aspectRatio as string, background: '#1e293b', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No video URL set</div>;
  }
  return (
    <div style={{ aspectRatio: props.aspectRatio as string, borderRadius: 12, overflow: 'hidden' }}>
      <video src={url} autoPlay={props.autoplay as boolean} muted={props.muted as boolean} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}
