import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/common/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | ClickAds",
  description: "Insights on AI marketing, ad strategy, SaaS growth, and performance advertising from the ClickAds team.",
  openGraph: {
    title: "Blog | ClickAds",
    description: "Insights on AI marketing, ad strategy, SaaS growth, and performance advertising from the ClickAds team.",
    url: "https://www.useclickads.com/blog",
    type: "website",
  },
  alternates: {
    canonical: "https://www.useclickads.com/blog",
  },
};

// Placeholder blog posts array — replace with actual data source (CMS, database, etc.)
const blogPosts = [
  {
    id: 1,
    title: "Coming Soon: Blog Posts",
    description: "Check back soon for insights on AI marketing, SaaS growth, and performance advertising.",
    date: new Date().toISOString(),
    slug: "coming-soon",
  },
];

export default function Blog() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.useclickads.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.useclickads.com/blog"
      }
    ]
  };

  return (
    <>
      <JsonLd data={blogSchema} />
      <main id="main-content">
        <Navbar />
        <section style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", textAlign: "center" }}>Blog</h1>
          <p style={{ fontSize: "1.1rem", color: "#999", maxWidth: "600px", textAlign: "center", marginBottom: "2rem" }}>
            Insights on AI marketing, ad strategy, SaaS growth, and performance advertising from the ClickAds team.
          </p>
          <div style={{ display: "grid", gap: "2rem", maxWidth: "800px", width: "100%" }}>
            {blogPosts.map((post) => (
              <article key={post.id} style={{ borderBottom: "1px solid #222", paddingBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{post.title}</h2>
                <p style={{ color: "#999", marginBottom: "1rem" }}>{post.description}</p>
                <time style={{ color: "#666", fontSize: "0.9rem" }}>
                  {new Date(post.date).toLocaleDateString()}
                </time>
              </article>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
