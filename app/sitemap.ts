import { MetadataRoute } from "next";

// Slugify function — same logic as your post titles
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const BLOG_POSTS = [
  { title: "How to build a high-converting ad campaign in 2026",          date: "2026-05-12" },
  { title: "Understanding click-through rates: what's good and what isn't", date: "2026-04-28" },
  { title: "Retargeting done right: turn visitors into paying customers",  date: "2026-04-14" },
  { title: "AI automation: the 5 workflows every agency should replace first", date: "2026-04-02" },
  { title: "Why vertical SaaS is the best business model for agencies in 2026", date: "2026-03-24" },
  { title: "Google vs Meta in 2026: where to put your first ₹50,000",     date: "2026-03-14" },
  { title: "The gym CRM problem: why generic software fails fitness businesses", date: "2026-03-04" },
  { title: "Brand before budget: why most small businesses advertise too early", date: "2026-02-22" },
  { title: "How we build travel itineraries in under 60 seconds with AI", date: "2026-02-12" },
  { title: "Lead generation for B2B services: what works in India in 2026", date: "2026-02-02" },
  { title: "GA4 is broken for most businesses — here is how to fix it",   date: "2026-01-22" },
  { title: "The 90-day growth sprint: from zero to traction",             date: "2026-01-12" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.useclickads.com";

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${slugify(post.title)}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    { url: baseUrl,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 1   },
    { url: `${baseUrl}/services`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/products`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/blog`,         lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
    { url: `${baseUrl}/contact`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/resources`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${baseUrl}/company`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...blogEntries,
  ];
}