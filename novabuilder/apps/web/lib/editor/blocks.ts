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
  {
    type: 'code',
    label: 'Custom Code',
    icon: '</>',
    category: 'interactive',
    defaultProps: {
      html: '<div style="padding: 20px; text-align: center; color: #64748b;">Custom HTML code here</div>',
      css: '',
    },
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: '─',
    category: 'layout',
    defaultProps: {
      style: 'solid',
      color: '#e2e8f0',
      thickness: '1px',
      width: '100%',
      margin: '24px 0',
    },
  },
  {
    type: 'testimonial',
    label: 'Testimonial',
    icon: '❝',
    category: 'content',
    defaultProps: {
      quote: 'This product changed my workflow completely. Highly recommended!',
      author: 'Jane Doe',
      role: 'CEO, Acme Inc.',
      avatarUrl: '',
      rating: 5,
    },
  },
  {
    type: 'pricing',
    label: 'Pricing',
    icon: '$',
    category: 'content',
    defaultProps: {
      planName: 'Pro',
      price: '$29',
      period: '/month',
      features: JSON.stringify(['Unlimited projects', '100GB storage', 'Priority support', 'Custom domains']),
      buttonText: 'Get Started',
      buttonUrl: '#',
      highlighted: false,
    },
  },
  {
    type: 'faq',
    label: 'FAQ',
    icon: '?',
    category: 'content',
    defaultProps: {
      heading: 'Frequently Asked Questions',
      items: JSON.stringify([
        { question: 'How do I get started?', answer: 'Sign up for a free account and create your first project.' },
        { question: 'Can I use a custom domain?', answer: 'Yes! You can connect your own domain in the project settings.' },
        { question: 'Is there a free plan?', answer: 'Yes, our free plan includes 3 projects and 10 pages per project.' },
      ]),
    },
  },
  {
    type: 'gallery',
    label: 'Gallery',
    icon: '⊞',
    category: 'media',
    defaultProps: {
      images: JSON.stringify([]),
      columns: 3,
      gap: '8px',
      borderRadius: '8px',
    },
  },
  {
    type: 'map',
    label: 'Map Embed',
    icon: '⊕',
    category: 'media',
    defaultProps: {
      embedUrl: '',
      height: '400px',
      borderRadius: '8px',
    },
  },
  {
    type: 'countdown',
    label: 'Countdown',
    icon: '⏱',
    category: 'interactive',
    defaultProps: {
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      heading: 'Launching Soon',
      expiredText: 'We are live!',
    },
  },
];

export function getBlockDefinition(type: string) {
  return BLOCK_DEFINITIONS.find((b) => b.type === type);
}

export function getBlocksByCategory(category: string) {
  return BLOCK_DEFINITIONS.filter((b) => b.category === category);
}
