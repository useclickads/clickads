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
  {
    id: 'saas-landing',
    name: 'SaaS Landing',
    description: 'Product landing with pricing and testimonials.',
    blocks: [
      { id: genId(), type: 'navigation', props: { brand: 'ProductName', links: JSON.stringify([{ label: 'Features', url: '#features' }, { label: 'Pricing', url: '#pricing' }, { label: 'Login', url: '/login' }]) } },
      { id: genId(), type: 'hero', props: { heading: 'Ship faster with our platform', subheading: 'The modern toolkit for teams that move fast.', buttonText: 'Start Free Trial', buttonUrl: '#', align: 'center' } },
      { id: genId(), type: 'spacer', props: { height: '48px' } },
      { id: genId(), type: 'columns', props: { columns: '3', gap: '24px' }, children: [
        { id: genId(), type: 'card', props: { title: 'Lightning Fast', description: 'Optimized for speed at every layer.' } },
        { id: genId(), type: 'card', props: { title: 'Team Ready', description: 'Built-in collaboration for your entire team.' } },
        { id: genId(), type: 'card', props: { title: 'Secure', description: 'Enterprise-grade security out of the box.' } },
      ]},
      { id: genId(), type: 'spacer', props: { height: '48px' } },
      { id: genId(), type: 'testimonial', props: { quote: 'This tool transformed our workflow. We shipped 3x faster in the first month.', author: 'Sarah Chen', role: 'CTO, TechCorp', avatarUrl: '', rating: 5 } },
      { id: genId(), type: 'spacer', props: { height: '48px' } },
      { id: genId(), type: 'columns', props: { columns: '3', gap: '16px' }, children: [
        { id: genId(), type: 'pricing', props: { planName: 'Starter', price: '$0', period: '/month', features: JSON.stringify(['3 projects', '1 team member', 'Community support']), buttonText: 'Get Started', buttonUrl: '#', highlighted: false } },
        { id: genId(), type: 'pricing', props: { planName: 'Pro', price: '$29', period: '/month', features: JSON.stringify(['Unlimited projects', '10 team members', 'Priority support', 'Custom domain']), buttonText: 'Start Trial', buttonUrl: '#', highlighted: true } },
        { id: genId(), type: 'pricing', props: { planName: 'Enterprise', price: '$99', period: '/month', features: JSON.stringify(['Everything in Pro', 'Unlimited members', 'SSO', 'SLA']), buttonText: 'Contact Sales', buttonUrl: '#', highlighted: false } },
      ]},
      { id: genId(), type: 'spacer', props: { height: '48px' } },
      { id: genId(), type: 'faq', props: { heading: 'Frequently Asked Questions', items: JSON.stringify([{ question: 'Is there a free plan?', answer: 'Yes! Our Starter plan is free forever.' }, { question: 'Can I cancel anytime?', answer: 'Absolutely. No contracts, cancel anytime.' }, { question: 'Do you offer a money-back guarantee?', answer: 'Yes, 30-day money-back guarantee on all paid plans.' }]) } },
      { id: genId(), type: 'footer', props: { text: '© 2026 ProductName. All rights reserved.', links: JSON.stringify([{ label: 'Privacy', url: '/privacy' }, { label: 'Terms', url: '/terms' }]) } },
    ],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase work with gallery and bio.',
    blocks: [
      { id: genId(), type: 'navigation', props: { brand: 'Jane Doe', links: JSON.stringify([{ label: 'Work', url: '#work' }, { label: 'About', url: '#about' }, { label: 'Contact', url: '#contact' }]) } },
      { id: genId(), type: 'hero', props: { heading: 'Designer & Developer', subheading: 'Creating beautiful digital experiences', buttonText: 'View My Work', buttonUrl: '#work', align: 'center' } },
      { id: genId(), type: 'spacer', props: { height: '48px' } },
      { id: genId(), type: 'text', props: { content: 'Selected Work', fontSize: '1.5rem', color: '#0f172a', align: 'center' } },
      { id: genId(), type: 'gallery', props: { images: JSON.stringify([]), columns: 3, gap: '12px', borderRadius: '12px' } },
      { id: genId(), type: 'spacer', props: { height: '48px' } },
      { id: genId(), type: 'testimonial', props: { quote: 'Jane delivered exceptional work that exceeded our expectations. Highly recommend!', author: 'Alex Rivera', role: 'Product Lead, DesignCo', avatarUrl: '', rating: 5 } },
      { id: genId(), type: 'divider', props: { style: 'solid', color: '#e2e8f0', thickness: '1px', width: '60%', margin: '48px auto' } },
      { id: genId(), type: 'form', props: { heading: 'Get In Touch', fields: JSON.stringify([{ name: 'name', type: 'text', label: 'Name', required: true }, { name: 'email', type: 'email', label: 'Email', required: true }, { name: 'message', type: 'textarea', label: 'Message', required: true }]), submitText: 'Send Message' } },
      { id: genId(), type: 'footer', props: { text: '© 2026 Jane Doe. All rights reserved.', links: JSON.stringify([{ label: 'LinkedIn', url: '#' }, { label: 'Dribbble', url: '#' }]) } },
    ],
  },
  {
    id: 'coming-soon',
    name: 'Coming Soon',
    description: 'Pre-launch page with countdown timer.',
    blocks: [
      { id: genId(), type: 'spacer', props: { height: '60px' } },
      { id: genId(), type: 'text', props: { content: 'Something amazing is coming', fontSize: '2rem', color: '#0f172a', align: 'center' } },
      { id: genId(), type: 'text', props: { content: 'We are working hard to bring you something incredible. Stay tuned!', fontSize: '1rem', color: '#64748b', align: 'center' } },
      { id: genId(), type: 'spacer', props: { height: '32px' } },
      { id: genId(), type: 'countdown', props: { targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), heading: 'Launching In', expiredText: 'We are live!' } },
      { id: genId(), type: 'spacer', props: { height: '32px' } },
      { id: genId(), type: 'form', props: { heading: 'Get notified when we launch', fields: JSON.stringify([{ name: 'email', type: 'email', label: 'Email', required: true }]), submitText: 'Notify Me' } },
    ],
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Menu display with contact and map.',
    blocks: [
      { id: genId(), type: 'navigation', props: { brand: 'Ristorante', links: JSON.stringify([{ label: 'Menu', url: '#menu' }, { label: 'About', url: '#about' }, { label: 'Reservations', url: '#reservations' }]) } },
      { id: genId(), type: 'hero', props: { heading: 'Fine Dining Experience', subheading: 'Fresh ingredients. Authentic flavors. Unforgettable moments.', buttonText: 'Reserve a Table', buttonUrl: '#reservations', align: 'center' } },
      { id: genId(), type: 'spacer', props: { height: '48px' } },
      { id: genId(), type: 'columns', props: { columns: '2', gap: '24px' }, children: [
        { id: genId(), type: 'card', props: { title: 'Appetizers', description: 'Bruschetta, Caprese Salad, Soup of the Day, Calamari Fritti' } },
        { id: genId(), type: 'card', props: { title: 'Main Courses', description: 'Grilled Salmon, Filet Mignon, Pasta Primavera, Chicken Marsala' } },
      ]},
      { id: genId(), type: 'spacer', props: { height: '24px' } },
      { id: genId(), type: 'testimonial', props: { quote: 'The best dining experience in town. Every dish is a masterpiece.', author: 'Food Critics Weekly', role: '', avatarUrl: '', rating: 5 } },
      { id: genId(), type: 'spacer', props: { height: '24px' } },
      { id: genId(), type: 'map', props: { embedUrl: '', height: '300px', borderRadius: '12px' } },
      { id: genId(), type: 'spacer', props: { height: '24px' } },
      { id: genId(), type: 'form', props: { heading: 'Make a Reservation', fields: JSON.stringify([{ name: 'name', type: 'text', label: 'Name', required: true }, { name: 'email', type: 'email', label: 'Email', required: true }, { name: 'date', type: 'date', label: 'Date', required: true }, { name: 'guests', type: 'number', label: 'Guests', required: true }]), submitText: 'Reserve' } },
      { id: genId(), type: 'footer', props: { text: '© 2026 Ristorante. All rights reserved.', links: JSON.stringify([{ label: 'Instagram', url: '#' }, { label: 'Facebook', url: '#' }]) } },
    ],
  },
];
