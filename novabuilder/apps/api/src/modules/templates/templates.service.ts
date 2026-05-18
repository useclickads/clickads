import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type TemplateCategory = 'business' | 'portfolio' | 'ecommerce' | 'blog' | 'landing' | 'saas' | 'other';

type ProjectTemplate = {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail: string;
  previewUrl: string;
  pages: Array<{ title: string; slug: string; path: string; content: unknown; seo: unknown }>;
  tokens: Array<{ key: string; value: unknown }>;
  settings: Record<string, unknown>;
  tags: string[];
  popularity: number;
};

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  private builtInTemplates: ProjectTemplate[] = [
    {
      id: 'tpl_startup_landing',
      name: 'Startup Landing Page',
      description: 'Clean, modern landing page with hero, features, pricing, and CTA sections.',
      category: 'landing',
      thumbnail: '/templates/startup-landing.png',
      previewUrl: '/templates/preview/startup-landing',
      pages: [
        {
          title: 'Home', slug: 'index', path: '/',
          content: [
            { type: 'hero', props: { title: 'Build Something Amazing', subtitle: 'Launch your product with confidence', ctaText: 'Get Started', ctaLink: '#pricing' } },
            { type: 'features', props: { columns: 3, items: [{ title: 'Fast', description: 'Optimized for speed' }, { title: 'Secure', description: 'Enterprise-grade security' }, { title: 'Scalable', description: 'Grows with your business' }] } },
            { type: 'pricing', props: { plans: [{ name: 'Free', price: '$0', features: ['1 project', 'Basic support'] }, { name: 'Pro', price: '$29', features: ['Unlimited projects', 'Priority support', 'Custom domain'] }] } },
            { type: 'cta', props: { title: 'Ready to start?', buttonText: 'Sign Up Free', buttonLink: '/signup' } },
            { type: 'footer', props: { links: [{ label: 'Privacy', url: '/privacy' }, { label: 'Terms', url: '/terms' }] } },
          ],
          seo: { title: 'Your Startup - Build Something Amazing', description: 'Launch your product with our modern, fast, and scalable platform.' },
        },
      ],
      tokens: [
        { key: 'primaryColor', value: '#6366f1' },
        { key: 'fontFamily', value: 'Inter, sans-serif' },
      ],
      settings: {},
      tags: ['startup', 'saas', 'modern'],
      popularity: 95,
    },
    {
      id: 'tpl_portfolio',
      name: 'Creative Portfolio',
      description: 'Showcase your work with a minimal, image-focused portfolio layout.',
      category: 'portfolio',
      thumbnail: '/templates/portfolio.png',
      previewUrl: '/templates/preview/portfolio',
      pages: [
        {
          title: 'Portfolio', slug: 'index', path: '/',
          content: [
            { type: 'hero', props: { title: 'John Doe', subtitle: 'Designer & Developer', background: '#0f172a' } },
            { type: 'gallery', props: { columns: 3, images: [] } },
            { type: 'text', props: { content: 'A passionate creator focused on building beautiful digital experiences.' } },
            { type: 'contact', props: { email: 'hello@example.com' } },
          ],
          seo: { title: 'John Doe - Portfolio', description: 'Creative portfolio showcasing design and development work.' },
        },
        {
          title: 'About', slug: 'about', path: '/about',
          content: [
            { type: 'heading', props: { level: 1, text: 'About Me' } },
            { type: 'text', props: { content: 'Share your story here...' } },
          ],
          seo: { title: 'About - John Doe', description: 'Learn more about John Doe.' },
        },
      ],
      tokens: [
        { key: 'primaryColor', value: '#0f172a' },
        { key: 'fontFamily', value: 'Space Grotesk, sans-serif' },
      ],
      settings: {},
      tags: ['portfolio', 'creative', 'minimal'],
      popularity: 88,
    },
    {
      id: 'tpl_blog',
      name: 'Modern Blog',
      description: 'Content-first blog template with CMS-powered posts and categories.',
      category: 'blog',
      thumbnail: '/templates/blog.png',
      previewUrl: '/templates/preview/blog',
      pages: [
        {
          title: 'Blog', slug: 'index', path: '/',
          content: [
            { type: 'heading', props: { level: 1, text: 'My Blog' } },
            { type: 'text', props: { content: 'Thoughts on technology, design, and life.' } },
            { type: 'cms-list', props: { collection: 'posts', limit: 10, layout: 'cards' } },
          ],
          seo: { title: 'My Blog', description: 'Read the latest articles on tech and design.' },
        },
      ],
      tokens: [
        { key: 'primaryColor', value: '#059669' },
        { key: 'fontFamily', value: 'Merriweather, serif' },
      ],
      settings: {},
      tags: ['blog', 'content', 'writing'],
      popularity: 82,
    },
    {
      id: 'tpl_ecommerce',
      name: 'E-Commerce Store',
      description: 'Product-focused store template with catalog, cart, and checkout flows.',
      category: 'ecommerce',
      thumbnail: '/templates/ecommerce.png',
      previewUrl: '/templates/preview/ecommerce',
      pages: [
        {
          title: 'Shop', slug: 'index', path: '/',
          content: [
            { type: 'hero', props: { title: 'Summer Collection', subtitle: 'Discover our latest products', ctaText: 'Shop Now', ctaLink: '#products' } },
            { type: 'product-grid', props: { columns: 4, featured: true } },
            { type: 'testimonials', props: { items: [{ name: 'Sarah', text: 'Great quality!', rating: 5 }] } },
            { type: 'footer', props: { links: [{ label: 'Shipping', url: '/shipping' }, { label: 'Returns', url: '/returns' }] } },
          ],
          seo: { title: 'Our Store - Summer Collection', description: 'Shop the latest products with free shipping.' },
        },
      ],
      tokens: [
        { key: 'primaryColor', value: '#dc2626' },
        { key: 'fontFamily', value: 'DM Sans, sans-serif' },
      ],
      settings: {},
      tags: ['ecommerce', 'store', 'products'],
      popularity: 78,
    },
    {
      id: 'tpl_saas_docs',
      name: 'SaaS Documentation',
      description: 'Technical documentation site with sidebar navigation and search.',
      category: 'saas',
      thumbnail: '/templates/docs.png',
      previewUrl: '/templates/preview/docs',
      pages: [
        {
          title: 'Getting Started', slug: 'index', path: '/',
          content: [
            { type: 'heading', props: { level: 1, text: 'Documentation' } },
            { type: 'text', props: { content: 'Welcome to our documentation. Get started quickly with our guides.' } },
            { type: 'cards', props: { items: [{ title: 'Quick Start', link: '/quickstart' }, { title: 'API Reference', link: '/api' }, { title: 'Examples', link: '/examples' }] } },
          ],
          seo: { title: 'Documentation - Getting Started', description: 'Learn how to use our platform with comprehensive guides.' },
        },
      ],
      tokens: [
        { key: 'primaryColor', value: '#2563eb' },
        { key: 'fontFamily', value: 'JetBrains Mono, monospace' },
      ],
      settings: {},
      tags: ['docs', 'technical', 'saas'],
      popularity: 72,
    },
  ];

  async listTemplates(category?: string, search?: string) {
    let templates = [...this.builtInTemplates];

    if (category) {
      templates = templates.filter((t) => t.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      templates = templates.filter(
        (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q)),
      );
    }

    return templates
      .sort((a, b) => b.popularity - a.popularity)
      .map(({ pages, tokens, settings, ...rest }) => rest);
  }

  async getTemplate(templateId: string) {
    return this.builtInTemplates.find((t) => t.id === templateId) || null;
  }

  async createProjectFromTemplate(templateId: string, userId: string, projectName: string, projectSlug: string) {
    const template = this.builtInTemplates.find((t) => t.id === templateId);
    if (!template) return null;

    const project = await this.prisma.client.project.create({
      data: {
        name: projectName,
        slug: projectSlug,
        ownerId: userId,
        description: `Created from template: ${template.name}`,
      },
    });

    for (const page of template.pages) {
      await this.prisma.client.page.create({
        data: {
          projectId: project.id,
          title: page.title,
          slug: page.slug,
          path: page.path,
          content: page.content as any,
          seo: page.seo as any,
          published: false,
        },
      });
    }

    for (const token of template.tokens) {
      await this.prisma.client.designToken.create({
        data: {
          projectId: project.id,
          key: token.key,
          value: token.value as any,
        },
      });
    }

    return { projectId: project.id, template: template.name, pagesCreated: template.pages.length };
  }

  getCategories(): Array<{ id: string; label: string; count: number }> {
    const categories = new Map<string, number>();
    for (const t of this.builtInTemplates) {
      categories.set(t.category, (categories.get(t.category) || 0) + 1);
    }

    const labels: Record<string, string> = {
      business: 'Business', portfolio: 'Portfolio', ecommerce: 'E-Commerce',
      blog: 'Blog', landing: 'Landing Page', saas: 'SaaS', other: 'Other',
    };

    return Array.from(categories.entries()).map(([id, count]) => ({
      id, label: labels[id] || id, count,
    }));
  }
}
