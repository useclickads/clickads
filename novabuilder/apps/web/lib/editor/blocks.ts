import type { BlockDefinition } from './types';

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'hero',
    label: 'Hero',
    icon: '◆',
    category: 'layout',
    defaultProps: {
      heading: 'Welcome to your site',
      subheading: 'Build something amazing with NovaBuilder.',
      buttonText: 'Get Started',
      buttonUrl: '#',
      backgroundUrl: '',
      align: 'center',
    },
  },
  {
    type: 'text',
    label: 'Text',
    icon: '¶',
    category: 'content',
    defaultProps: {
      content: 'Add your text content here. Click to edit.',
      fontSize: '1rem',
      color: '#1e293b',
      align: 'left',
    },
  },
  {
    type: 'image',
    label: 'Image',
    icon: '▣',
    category: 'media',
    defaultProps: {
      src: '',
      alt: 'Image',
      width: '100%',
      height: 'auto',
      borderRadius: '8px',
    },
  },
  {
    type: 'button',
    label: 'Button',
    icon: '▶',
    category: 'interactive',
    defaultProps: {
      text: 'Click me',
      url: '#',
      variant: 'primary',
      size: 'medium',
      align: 'left',
    },
  },
  {
    type: 'columns',
    label: 'Columns',
    icon: '▥',
    category: 'layout',
    defaultProps: {
      columns: 2,
      gap: '24px',
    },
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: '—',
    category: 'layout',
    defaultProps: {
      height: '48px',
    },
  },
  {
    type: 'card',
    label: 'Card',
    icon: '❒',
    category: 'content',
    defaultProps: {
      title: 'Card Title',
      description: 'Card description goes here.',
      imageUrl: '',
      linkUrl: '#',
      linkText: 'Learn more',
    },
  },
  {
    type: 'navigation',
    label: 'Navigation',
    icon: '☰',
    category: 'layout',
    defaultProps: {
      brand: 'MyBrand',
      links: JSON.stringify([
        { label: 'Home', url: '/' },
        { label: 'About', url: '/about' },
        { label: 'Contact', url: '/contact' },
      ]),
    },
  },
  {
    type: 'footer',
    label: 'Footer',
    icon: '▬',
    category: 'layout',
    defaultProps: {
      text: '© 2026 Your Company. All rights reserved.',
      links: JSON.stringify([
        { label: 'Privacy', url: '/privacy' },
        { label: 'Terms', url: '/terms' },
      ]),
    },
  },
  {
    type: 'form',
    label: 'Form',
    icon: '✎',
    category: 'interactive',
    defaultProps: {
      heading: 'Contact Us',
      fields: JSON.stringify([
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'message', type: 'textarea', label: 'Message', required: false },
      ]),
      submitText: 'Send',
    },
  },
  {
    type: 'video',
    label: 'Video',
    icon: '▷',
    category: 'media',
    defaultProps: {
      url: '',
      autoplay: false,
      muted: true,
      aspectRatio: '16/9',
    },
  },
];

export function getBlockDefinition(type: string) {
  return BLOCK_DEFINITIONS.find((b) => b.type === type);
}

export function getBlocksByCategory(category: string) {
  return BLOCK_DEFINITIONS.filter((b) => b.category === category);
}
