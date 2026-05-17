import type { Block } from './types';

export type PageTemplate = {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
};

let uid = 0;
function genId() { return `tpl-${++uid}-${Date.now()}`; }

export const pageTemplates: PageTemplate[] = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start from scratch with an empty page.',
    blocks: [],
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Hero section, features, and call-to-action.',
    blocks: [
      { id: genId(), type: 'hero', props: { heading: 'Welcome to Your Site', subheading: 'Build something amazing with NovaBuilder', buttonText: 'Get Started', buttonUrl: '#', align: 'center' } },
      { id: genId(), type: 'spacer', props: { height: '48px' } },
      { id: genId(), type: 'columns', props: { columns: '3', gap: '24px' }, children: [
        { id: genId(), type: 'card', props: { title: 'Fast', description: 'Lightning-fast page loads with static generation.' } },
        { id: genId(), type: 'card', props: { title: 'Flexible', description: 'Drag-and-drop blocks to create any layout.' } },
        { id: genId(), type: 'card', props: { title: 'Beautiful', description: 'Professional designs with zero coding required.' } },
      ]},
      { id: genId(), type: 'spacer', props: { height: '48px' } },
      { id: genId(), type: 'text', props: { content: 'Ready to get started? Create your first page and start building.', fontSize: '1.1rem', color: '#475569', align: 'center' } },
      { id: genId(), type: 'button', props: { text: 'Start Building', url: '#', align: 'center' } },
    ],
  },
  {
    id: 'about',
    name: 'About Page',
    description: 'Company info with team introduction.',
    blocks: [
      { id: genId(), type: 'hero', props: { heading: 'About Us', subheading: 'Learn more about our mission and team', align: 'center' } },
      { id: genId(), type: 'spacer', props: { height: '32px' } },
      { id: genId(), type: 'text', props: { content: 'We are a team of passionate builders creating tools that empower everyone to build on the web. Our mission is to democratize web development and make it accessible to all.', fontSize: '1rem', color: '#334155', align: 'left' } },
      { id: genId(), type: 'spacer', props: { height: '24px' } },
      { id: genId(), type: 'columns', props: { columns: '2', gap: '24px' }, children: [
        { id: genId(), type: 'card', props: { title: 'Our Mission', description: 'To make professional web presence accessible to every business and individual.' } },
        { id: genId(), type: 'card', props: { title: 'Our Vision', description: 'A world where anyone can build and publish a beautiful website in minutes.' } },
      ]},
    ],
  },
  {
    id: 'contact',
    name: 'Contact Page',
    description: 'Contact form with information.',
    blocks: [
      { id: genId(), type: 'hero', props: { heading: 'Contact Us', subheading: 'We\'d love to hear from you', align: 'center' } },
      { id: genId(), type: 'spacer', props: { height: '32px' } },
      { id: genId(), type: 'columns', props: { columns: '2', gap: '32px' }, children: [
        { id: genId(), type: 'text', props: { content: 'Email: hello@example.com\nPhone: (555) 123-4567\nAddress: 123 Main St, City, ST 12345', fontSize: '1rem', color: '#334155', align: 'left' } },
        { id: genId(), type: 'form', props: { fields: 'name,email,message', submitText: 'Send Message', action: '#' } },
      ]},
    ],
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Article layout with title and content.',
    blocks: [
      { id: genId(), type: 'text', props: { content: 'Blog Post Title', fontSize: '2.5rem', color: '#0f172a', align: 'left' } },
      { id: genId(), type: 'text', props: { content: 'Published on January 1, 2025', fontSize: '0.9rem', color: '#94a3b8', align: 'left' } },
      { id: genId(), type: 'spacer', props: { height: '24px' } },
      { id: genId(), type: 'image', props: { src: '', alt: 'Featured image', width: '100%', height: 'auto', borderRadius: '12px' } },
      { id: genId(), type: 'spacer', props: { height: '24px' } },
      { id: genId(), type: 'text', props: { content: 'Your blog post content goes here. Write about anything you want to share with your readers. Use blocks to add images, quotes, and other media throughout your article.', fontSize: '1rem', color: '#334155', align: 'left' } },
    ],
  },
];
