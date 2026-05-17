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
      return <ColumnsBlock block={block} />;
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
    case 'code':
      return <CodeBlock props={block.props} />;
    case 'divider':
      return <DividerBlock props={block.props} />;
    case 'testimonial':
      return <TestimonialBlock props={block.props} />;
    case 'pricing':
      return <PricingBlock props={block.props} />;
    case 'faq':
      return <FaqBlock props={block.props} />;
    case 'gallery':
      return <GalleryBlock props={block.props} />;
    case 'map':
      return <MapBlock props={block.props} />;
    case 'countdown':
      return <CountdownBlock props={block.props} />;
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

function ColumnsBlock({ block }: { block: Block }) {
  const cols = Number(block.props.columns) || 2;
  const children = block.children || [];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: block.props.gap as string, padding: '12px 0' }}>
      {Array.from({ length: cols }).map((_, i) => {
        const colChild = children[i];
        return (
          <div key={i} style={{ padding: colChild ? 0 : 24, background: '#f8fafc', borderRadius: 10, border: '1px dashed #cbd5e1', minHeight: 60 }}>
            {colChild ? (
              <BlockRenderer block={colChild} />
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', padding: 24 }}>
                Column {i + 1}
              </div>
            )}
          </div>
        );
      })}
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

function CodeBlock({ props }: { props: Record<string, unknown> }) {
  const html = props.html as string || '';
  const css = props.css as string || '';
  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      {css && <style>{css}</style>}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function DividerBlock({ props }: { props: Record<string, unknown> }) {
  return (
    <div style={{ margin: props.margin as string }}>
      <hr style={{ border: 'none', borderTop: `${props.thickness as string} ${props.style as string} ${props.color as string}`, width: props.width as string }} />
    </div>
  );
}

function TestimonialBlock({ props }: { props: Record<string, unknown> }) {
  const rating = Number(props.rating) || 0;
  return (
    <div style={{ padding: 28, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
      {rating > 0 && <div style={{ fontSize: '1.25rem', color: '#f59e0b', marginBottom: 12 }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div>}
      <p style={{ margin: 0, fontSize: '1.05rem', color: '#334155', lineHeight: 1.7, fontStyle: 'italic' }}>&ldquo;{props.quote as string}&rdquo;</p>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        {props.avatarUrl ? <img src={props.avatarUrl as string} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} /> : null}
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{props.author as string}</p>
          {String(props.role || '') && <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{String(props.role)}</p>}
        </div>
      </div>
    </div>
  );
}

function PricingBlock({ props }: { props: Record<string, unknown> }) {
  let features: string[] = [];
  try { features = JSON.parse(props.features as string); } catch {}
  const highlighted = props.highlighted as boolean;
  return (
    <div style={{ padding: 28, borderRadius: 16, background: highlighted ? '#0f172a' : '#fff', border: highlighted ? 'none' : '1px solid #e2e8f0', maxWidth: 320, textAlign: 'center' }}>
      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: highlighted ? '#94a3b8' : '#64748b' }}>{props.planName as string}</p>
      <p style={{ margin: '12px 0', fontSize: '2.5rem', fontWeight: 800, color: highlighted ? '#fff' : '#0f172a' }}>
        {props.price as string}<span style={{ fontSize: '1rem', fontWeight: 400, color: highlighted ? '#94a3b8' : '#64748b' }}>{props.period as string}</span>
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 24px', display: 'grid', gap: 8 }}>
        {features.map((f, i) => (
          <li key={i} style={{ fontSize: '0.9rem', color: highlighted ? '#cbd5e1' : '#475569' }}>&#10003; {f}</li>
        ))}
      </ul>
      <a href={props.buttonUrl as string} style={{
        display: 'inline-block', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
        background: highlighted ? '#fff' : '#0f172a', color: highlighted ? '#0f172a' : '#fff',
      }}>
        {props.buttonText as string}
      </a>
    </div>
  );
}

function FaqBlock({ props }: { props: Record<string, unknown> }) {
  let items: { question: string; answer: string }[] = [];
  try { items = JSON.parse(props.items as string); } catch {}
  return (
    <div style={{ padding: '16px 0' }}>
      {String(props.heading || '') && <h2 style={{ margin: '0 0 20px', fontSize: '1.3rem', color: '#0f172a', fontWeight: 700 }}>{String(props.heading)}</h2>}
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((item, i) => (
          <details key={i} style={{ padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <summary style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a', cursor: 'pointer' }}>{item.question}</summary>
            <p style={{ marginTop: 8, fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

function GalleryBlock({ props }: { props: Record<string, unknown> }) {
  let images: string[] = [];
  try { images = JSON.parse(props.images as string); } catch {}
  const cols = Number(props.columns) || 3;
  if (images.length === 0) {
    return <div style={{ padding: 32, background: '#f1f5f9', borderRadius: props.borderRadius as string, textAlign: 'center', color: '#94a3b8' }}>No images added to gallery</div>;
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: props.gap as string }}>
      {images.map((src, i) => (
        <img key={i} src={src} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: props.borderRadius as string }} />
      ))}
    </div>
  );
}

function MapBlock({ props }: { props: Record<string, unknown> }) {
  const url = props.embedUrl as string;
  if (!url) {
    return <div style={{ height: props.height as string, background: '#f1f5f9', borderRadius: props.borderRadius as string, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No map embed URL set</div>;
  }
  return (
    <iframe src={url} style={{ width: '100%', height: props.height as string, border: 'none', borderRadius: props.borderRadius as string }} loading="lazy" />
  );
}

function CountdownBlock({ props }: { props: Record<string, unknown> }) {
  const target = new Date(props.targetDate as string).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  if (diff === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center', borderRadius: 14, background: 'linear-gradient(135deg, #0f172a, #1e40af)' }}>
        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{props.expiredText as string}</p>
      </div>
    );
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const unitStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 };
  const numStyle: React.CSSProperties = { fontSize: '2rem', fontWeight: 800, color: '#fff' };
  const lblStyle: React.CSSProperties = { fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' };
  return (
    <div style={{ padding: 32, textAlign: 'center', borderRadius: 14, background: 'linear-gradient(135deg, #0f172a, #1e40af)' }}>
      {String(props.heading || '') && <p style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 700, color: '#cbd5e1' }}>{String(props.heading)}</p>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
        <div style={unitStyle}><span style={numStyle}>{days}</span><span style={lblStyle}>Days</span></div>
        <div style={unitStyle}><span style={numStyle}>{hours}</span><span style={lblStyle}>Hours</span></div>
        <div style={unitStyle}><span style={numStyle}>{minutes}</span><span style={lblStyle}>Min</span></div>
        <div style={unitStyle}><span style={numStyle}>{seconds}</span><span style={lblStyle}>Sec</span></div>
      </div>
    </div>
  );
}
