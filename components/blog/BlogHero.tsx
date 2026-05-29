// components/blog/BlogHero.tsx

import "@/styles/blog/blog.css";

export default function BlogHero() {
  return (
    <section className="blog-hero">
      <div className="blog-hero__grid" aria-hidden="true" />
      <div className="blog-hero__inner">

        <p className="blog-hero__eyebrow">AI Studio · Est. 2021</p>

        <h1 className="blog-hero__heading">
          <span className="blog-hero__line1">The growth playbook.</span>
          <span className="blog-hero__line2">From the campaign floor.</span>
        </h1>

        <p className="blog-hero__sub">
          Every post is a lesson from a live campaign.
          Read it, apply it, measure it.
        </p>

      </div>
    </section>
  );
}