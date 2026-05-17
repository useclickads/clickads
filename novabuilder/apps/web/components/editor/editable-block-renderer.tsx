'use client';

import type { Block } from '../../lib/editor/types';
import { useEditor } from '../../lib/editor/editor-context';
import { InlineEdit } from './inline-edit';
import { BlockRenderer } from './block-renderer';

export function EditableBlockRenderer({ block }: { block: Block }) {
  const { updateBlockProps } = useEditor();

  function update(key: string, value: string) {
    updateBlockProps(block.id, { [key]: value });
  }

  switch (block.type) {
    case 'hero':
      return <EditableHero block={block} onUpdate={update} />;
    case 'text':
      return <EditableText block={block} onUpdate={update} />;
    case 'button':
      return <EditableButton block={block} onUpdate={update} />;
    case 'card':
      return <EditableCard block={block} onUpdate={update} />;
    default:
      return <BlockRenderer block={block} />;
  }
}

function EditableHero({ block, onUpdate }: { block: Block; onUpdate: (k: string, v: string) => void }) {
  const { props } = block;
  const align = (props.align as string) || 'center';
  return (
    <div style={{ padding: '64px 32px', textAlign: align as any, background: props.backgroundUrl ? `url(${props.backgroundUrl}) center/cover` : 'linear-gradient(135deg, #0f172a, #1e40af)', borderRadius: 12 }}>
      <InlineEdit
        value={props.heading as string}
        onChange={(v) => onUpdate('heading', v)}
        tag="h1"
        style={{ margin: 0, fontSize: '2.5rem', color: '#fff', fontWeight: 800 }}
      />
      <InlineEdit
        value={props.subheading as string}
        onChange={(v) => onUpdate('subheading', v)}
        tag="p"
        style={{ marginTop: 12, fontSize: '1.1rem', color: '#cbd5e1' }}
      />
      {props.buttonText ? (
        <span style={{ display: 'inline-block', marginTop: 24, padding: '14px 28px', background: '#fff', color: '#0f172a', borderRadius: 10, fontWeight: 700 }}>
          <InlineEdit
            value={props.buttonText as string}
            onChange={(v) => onUpdate('buttonText', v)}
            tag="span"
            style={{ color: '#0f172a' }}
          />
        </span>
      ) : null}
    </div>
  );
}

function EditableText({ block, onUpdate }: { block: Block; onUpdate: (k: string, v: string) => void }) {
  const { props } = block;
  return (
    <div style={{ padding: '12px 0' }}>
      <InlineEdit
        value={props.content as string}
        onChange={(v) => onUpdate('content', v)}
        tag="div"
        style={{ fontSize: props.fontSize as string, color: props.color as string, textAlign: (props.align as any) || 'left', lineHeight: 1.7 }}
      />
    </div>
  );
}

function EditableButton({ block, onUpdate }: { block: Block; onUpdate: (k: string, v: string) => void }) {
  const { props } = block;
  const variant = props.variant as string;
  const size = props.size as string;
  const padding = size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px';
  const bg = variant === 'primary' ? '#0f172a' : variant === 'secondary' ? '#e2e8f0' : 'transparent';
  const color = variant === 'primary' ? '#fff' : '#0f172a';
  const border = variant === 'outline' ? '2px solid #0f172a' : 'none';
  return (
    <div style={{ textAlign: (props.align as any) || 'left' }}>
      <span style={{ display: 'inline-block', padding, background: bg, color, border, borderRadius: 10, fontWeight: 700 }}>
        <InlineEdit
          value={props.text as string}
          onChange={(v) => onUpdate('text', v)}
          tag="span"
          style={{ color, fontSize: '0.95rem' }}
        />
      </span>
    </div>
  );
}

function EditableCard({ block, onUpdate }: { block: Block; onUpdate: (k: string, v: string) => void }) {
  const { props } = block;
  return (
    <div style={{ padding: 24, borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0', maxWidth: 400 }}>
      {props.imageUrl ? <img src={props.imageUrl as string} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 16 }} /> : null}
      <InlineEdit
        value={props.title as string}
        onChange={(v) => onUpdate('title', v)}
        tag="h3"
        style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}
      />
      <InlineEdit
        value={props.description as string}
        onChange={(v) => onUpdate('description', v)}
        tag="p"
        style={{ marginTop: 8, color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}
      />
      {props.linkText ? (
        <span style={{ display: 'inline-block', marginTop: 12, color: '#2563eb', fontWeight: 600 }}>
          {String(props.linkText)} →
        </span>
      ) : null}
    </div>
  );
}
