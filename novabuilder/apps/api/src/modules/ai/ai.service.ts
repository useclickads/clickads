import { Injectable } from '@nestjs/common';

type Block = { id: string; type: string; props: Record<string, unknown> };

const BLOCK_TYPES = ['hero', 'text', 'image', 'button', 'columns', 'spacer', 'card', 'navigation', 'footer', 'form', 'video'] as const;

@Injectable()
export class AiService {
  async generatePage(prompt: string): Promise<{ blocks: Block[] }> {
    const blocks = this.buildBlocksFromPrompt(prompt);
    return { blocks };
  }

  async suggestBlocks(context: { existingBlocks: Block[]; prompt?: string }): Promise<Block[]> {
    const suggestions: Block[] = [];
    const existing = new Set(context.existingBlocks.map((b) => b.type));

    if (!existing.has('hero')) {
      suggestions.push(this.makeBlock('hero', { title: 'Welcome', subtitle: 'Add a compelling headline here' }));
    }
    if (!existing.has('navigation')) {
      suggestions.push(this.makeBlock('navigation', { brand: 'Brand', links: ['Home', 'About', 'Contact'] }));
    }
    if (context.existingBlocks.length > 2 && !existing.has('footer')) {
      suggestions.push(this.makeBlock('footer', { text: '© 2026 Company. All rights reserved.' }));
    }
    if (!existing.has('form') && context.prompt?.toLowerCase().includes('contact')) {
      suggestions.push(this.makeBlock('form', { formName: 'contact', fields: ['name', 'email', 'message'], submitLabel: 'Send' }));
    }
    if (suggestions.length === 0) {
      suggestions.push(this.makeBlock('text', { content: 'Add more content to engage your visitors.' }));
      suggestions.push(this.makeBlock('card', { title: 'Feature', description: 'Describe a key feature' }));
    }

    return suggestions.slice(0, 3);
  }

  async generateCopy(params: { type: 'headline' | 'paragraph' | 'cta' | 'tagline'; topic?: string; tone?: string }): Promise<{ text: string }> {
    const templates: Record<string, string[]> = {
      headline: [
        `Build something extraordinary with ${params.topic || 'our platform'}`,
        `The smarter way to ${params.topic || 'grow your business'}`,
        `Transform how you ${params.topic || 'work'} — starting today`,
      ],
      paragraph: [
        `Our ${params.topic || 'solution'} helps teams move faster, collaborate better, and ship with confidence. Built for modern teams who demand excellence without complexity.`,
        `Whether you're a startup or enterprise, ${params.topic || 'our platform'} scales with you. No technical expertise required — just results.`,
      ],
      cta: [
        'Get Started Free',
        'Start Your Journey',
        `Try ${params.topic || 'It'} Now`,
        'Book a Demo',
      ],
      tagline: [
        `${params.topic || 'Innovation'} meets simplicity`,
        `Where ${params.topic || 'ideas'} become reality`,
        `The future of ${params.topic || 'building'} is here`,
      ],
    };

    const options = templates[params.type] || templates.headline;
    const text = options[Math.floor(Math.random() * options.length)];
    return { text };
  }

  async improveContent(content: string): Promise<{ improved: string; suggestions: string[] }> {
    const suggestions: string[] = [];
    let improved = content;

    if (content.length < 50) suggestions.push('Consider adding more detail to engage readers');
    if (!content.includes('.')) suggestions.push('Break long text into sentences for readability');
    if (content === content.toLowerCase()) {
      improved = content.charAt(0).toUpperCase() + content.slice(1);
      suggestions.push('Capitalize the first letter');
    }
    if (content.split(' ').length > 50) suggestions.push('Consider breaking into multiple paragraphs');

    return { improved, suggestions };
  }

  private buildBlocksFromPrompt(prompt: string): Block[] {
    const blocks: Block[] = [];
    const lower = prompt.toLowerCase();

    blocks.push(this.makeBlock('navigation', { brand: this.extractBrand(prompt), links: ['Home', 'About', 'Contact'] }));

    if (lower.includes('landing') || lower.includes('home') || !lower.includes('blog')) {
      blocks.push(this.makeBlock('hero', {
        title: this.generateTitle(prompt),
        subtitle: this.generateSubtitle(prompt),
        ctaText: 'Get Started',
      }));
    }

    if (lower.includes('feature') || lower.includes('service')) {
      blocks.push(this.makeBlock('columns', {
        columns: 3,
        children: [
          { title: 'Feature One', description: 'Describe the first feature' },
          { title: 'Feature Two', description: 'Describe the second feature' },
          { title: 'Feature Three', description: 'Describe the third feature' },
        ],
      }));
    }

    if (lower.includes('about') || lower.includes('story')) {
      blocks.push(this.makeBlock('text', { content: 'Tell your story here. Share what makes your brand unique and why customers should care.' }));
    }

    if (lower.includes('pricing') || lower.includes('plan')) {
      blocks.push(this.makeBlock('columns', {
        columns: 3,
        children: [
          { title: 'Basic', description: '$0/mo - Perfect for getting started' },
          { title: 'Pro', description: '$29/mo - For growing teams' },
          { title: 'Enterprise', description: 'Custom - For large organizations' },
        ],
      }));
    }

    if (lower.includes('testimonial') || lower.includes('review')) {
      blocks.push(this.makeBlock('card', { title: '"Amazing product!"', description: '— Happy Customer, CEO at Company' }));
    }

    if (lower.includes('contact') || lower.includes('form')) {
      blocks.push(this.makeBlock('form', { formName: 'contact', fields: ['name', 'email', 'message'], submitLabel: 'Send Message' }));
    }

    if (lower.includes('image') || lower.includes('gallery') || lower.includes('photo')) {
      blocks.push(this.makeBlock('image', { src: 'https://placehold.co/800x400', alt: 'Featured image' }));
    }

    if (lower.includes('video')) {
      blocks.push(this.makeBlock('video', { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }));
    }

    blocks.push(this.makeBlock('spacer', { height: 40 }));
    blocks.push(this.makeBlock('button', { text: 'Get Started Today', url: '#' }));
    blocks.push(this.makeBlock('footer', { text: '© 2026 Company. All rights reserved.' }));

    return blocks;
  }

  private makeBlock(type: string, props: Record<string, unknown>): Block {
    return { id: this.generateId(), type, props };
  }

  private generateId(): string {
    return `blk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  private extractBrand(prompt: string): string {
    const words = prompt.split(' ').filter((w) => w.length > 3 && w[0] === w[0].toUpperCase());
    return words[0] || 'Brand';
  }

  private generateTitle(prompt: string): string {
    if (prompt.toLowerCase().includes('saas')) return 'Build Better Software, Faster';
    if (prompt.toLowerCase().includes('agency')) return 'Creative Solutions for Modern Brands';
    if (prompt.toLowerCase().includes('ecommerce') || prompt.toLowerCase().includes('store')) return 'Shop the Latest Collection';
    if (prompt.toLowerCase().includes('portfolio')) return 'Work That Speaks for Itself';
    return 'Build Something Extraordinary';
  }

  private generateSubtitle(prompt: string): string {
    if (prompt.toLowerCase().includes('saas')) return 'The all-in-one platform for modern teams to collaborate, ship, and scale.';
    if (prompt.toLowerCase().includes('agency')) return 'We help brands tell their story through exceptional design and strategy.';
    return 'A modern platform designed for teams who want to move fast and build great things.';
  }
}
