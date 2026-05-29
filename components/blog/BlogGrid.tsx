// components/blog/BlogGrid.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import "@/styles/blog/blog.css";

type Tag = "Strategy" | "Analytics" | "Growth" | "SaaS" | "AI" | "Ads";

interface Post {
  id:       number;
  tag:      Tag;
  title:    string;
  excerpt:  string;
  date:     string;
  readTime: string;
  body:     string;
}

const FILTERS = ["All", "Strategy", "Analytics", "Growth", "SaaS", "AI", "Ads"] as const;

const POSTS: Post[] = [
  {
    id: 1, tag: "Strategy",
    title:   "How to build a high-converting ad campaign in 2026",
    excerpt: "The exact framework top brands use to structure campaigns that drive clicks, conversions, and measurable ROI from day one.",
    date: "May 12, 2026", readTime: "5 min",
    body: `Most ad campaigns fail before the first rupee is spent — not because the budget is wrong, but because the structure is wrong. In 2026, with AI-optimised bidding on every platform, the difference between a campaign that converts and one that bleeds money comes down to one framework applied before you hit publish.

Start with one goal. The most common mistake: campaigns trying to do too much. Pick one primary KPI — cost per qualified lead, ROAS, or cost per trial signup. Everything flows from that number.

Build audiences in layers. Cold (broad/lookalike), warm (site visitors 8–30 days), hot (site visitors 0–7 days, form abandoners). Each layer gets different creative and bidding strategy. Running all three simultaneously is what separates a full-funnel campaign from a boosted post.

The landing page is part of the campaign. A 5% CTR into a 1% landing page conversion is still a bad campaign. Headline must match the ad promise exactly. Single CTA above the fold. Load time under 2 seconds on mobile. Maximum 3 form fields.

One travel agency client rebuilt their campaign this way — same budget, new structure. CPL dropped from ₹2,800 to ₹680 in 45 days.`,
  },
  {
    id: 2, tag: "Analytics",
    title:   "Understanding click-through rates: what's good and what isn't",
    excerpt: "CTR benchmarks vary wildly by industry and format. Here's how to read your numbers and know when to optimise vs. when to stay the course.",
    date: "Apr 28, 2026", readTime: "4 min",
    body: `Click-through rate is the most misread metric in digital marketing. A 0.8% CTR on display ads might be excellent. A 6% CTR on search might be hiding a conversion problem. CTR without context is noise.

Platform benchmarks (2026): Google Search averages 3–6% (strong = 8%+). Google Display averages 0.3–0.6%. Meta Feed averages 0.9–1.5% (strong = 2.5%+). LinkedIn averages 0.3–0.7%. Email averages 1.5–3.5%.

When to worry: On Google Search, low CTR hurts your Quality Score and raises CPCs — fix by tightening headline-to-query match. On Meta, falling CTR with rising frequency above 3–4 means creative fatigue — rotate.

When not to worry: Display ads hitting 0.3%+ that generate assisted conversions. Video ads with high completion rates but low CTR — people are watching, that is still valuable.

The metric that matters more than CTR is cost per result. If CTR doubles but CPL doubles too, you have made the campaign worse. Fix the landing page conversion rate first.`,
  },
  {
    id: 3, tag: "Growth",
    title:   "Retargeting done right: turn visitors into paying customers",
    excerpt: "Most retargeting campaigns waste budget. Discover the targeting windows, creative strategies, and frequency caps that actually work.",
    date: "Apr 14, 2026", readTime: "6 min",
    body: `Retargeting is the most misused tool in digital advertising. The standard broken setup: one audience (all visitors, 90 days), one creative, no frequency cap, existing customers included. This treats someone who bounced in 30 seconds the same as someone who spent 8 minutes on your pricing page yesterday.

Three segments that convert: Hot (0–7 days, pricing page visitors) — show a direct offer, cap at 4 impressions per day. Warm (8–30 days, multi-page visitors) — show testimonials and case studies, cap at 2 per day. Cool (31–60 days) — re-engagement creative, problem-first messaging, cap at 1 per day.

Creative must match the temperature. Hot audiences need urgency and specificity. Warm need social proof. Cool need the pain-first hook — they barely remember you, so lead with their problem, not your features.

Exclusions are non-negotiable. Always exclude existing customers, recent converters (last 7 days), and high-frequency non-converters.

One SaaS client: same pixel data, rebuilt structure. CPL dropped from ₹380 to ₹94 in three weeks.`,
  },
  {
    id: 4, tag: "AI",
    title:   "AI automation: the 5 workflows every agency should replace first",
    excerpt: "Not all automation is equal. These five processes deliver the fastest ROI when handed to AI agents — and require the least setup.",
    date: "Apr 2, 2026", readTime: "5 min",
    body: `AI automation has a hype problem. Everyone talks about it; almost no one knows where to actually start. After auditing 30+ client operations, we have found five workflows that consistently deliver the fastest return.

Lead response emails. The average business takes 47 hours to respond to a new inquiry. An AI agent can respond in under 3 minutes, personalised to the inquiry type, 24/7. Conversion rates typically improve 3–5x.

CRM data entry. Sales teams spend an average of 5.5 hours per week manually updating records. An AI pipeline that reads emails, calls, and form submissions and updates fields automatically gives that time back immediately.

Weekly reporting. Pulling data from GA4, Meta, and Google Ads into a formatted report takes 2–3 hours manually. An automated pipeline does it in 4 minutes and delivers every Monday at 8am.

Invoice and document processing. Extracting data from PDFs, matching to records, filing — completely automatable with LLM-powered document reading. Typical saving: 6–10 hours per week per person.

Social media scheduling. Automated queues with human-in-the-loop approval at one checkpoint are the right balance.`,
  },
  {
    id: 5, tag: "SaaS",
    title:   "Why vertical SaaS is the best business model for agencies in 2026",
    excerpt: "Building software for a specific industry you already serve transforms project revenue into recurring revenue and creates a moat competitors cannot copy.",
    date: "Mar 24, 2026", readTime: "4 min",
    body: `The traditional agency model has a structural problem: every month starts at zero. Project revenue is lumpy, referral-dependent, and impossible to predict. Vertical SaaS — software built for one specific industry — solves this in a way no retainer model can.

The key insight: agencies already have the domain knowledge. You have spent years understanding how travel agencies manage leads, how gyms chase renewals, how consultancies handle client communication. That knowledge is the hardest part of building software.

The moat builds itself. A generic CRM can compete on features. A CRM built specifically for travel agencies — with an AI itinerary builder, WhatsApp integration, and a pipeline designed around how travel bookings actually close — cannot be replicated by a generic tool without starting from scratch.

The distribution advantage is real. Your agency clients become your first SaaS customers. They trust you, know your work, and need the software you have already observed them struggling without.

We built Lidflow for travel agencies and GrwFit for gyms after serving both industries for two years. The pattern works.`,
  },
  {
    id: 6, tag: "Ads",
    title:   "Google vs Meta in 2026: where to put your first ₹50,000",
    excerpt: "The platform debate never ends, but the answer depends entirely on your business type. Here is the decision framework we use with every new client.",
    date: "Mar 14, 2026", readTime: "4 min",
    body: `The Google vs Meta question comes up in every new client call. The honest answer: it depends on your business — but there is a clear framework that makes the decision obvious in under five minutes.

Start with intent. Google Search captures demand that already exists. Someone searches "travel agency Pune" — they want what you sell, right now. Meta creates demand that does not exist yet. If people actively search for what you sell, Google first. If not, Meta first.

The ticket size rule. For high-ticket services above ₹20,000 per transaction, Google Search typically delivers higher-quality leads because intent is pre-qualified. For lower-ticket products where volume matters, Meta's scale and targeting depth often win.

The testing reality. With ₹50,000, run a meaningful Google Search test (₹35,000) and a small Meta test (₹15,000) simultaneously for 3–4 weeks. That data tells you exactly which platform converts for your specific offer.

Our default for new B2B clients in India: 70% Google Search, 30% Meta retargeting. Adjust after week four based on CPL data.`,
  },
  {
    id: 7, tag: "SaaS",
    title:   "The gym CRM problem: why generic software fails fitness businesses",
    excerpt: "Gyms have different operational needs than any other business. We built GrwFit after watching clients struggle with tools that almost worked.",
    date: "Mar 4, 2026", readTime: "3 min",
    body: `Gym owners are some of the most operational business owners we work with. They are managing memberships, attendance, renewals, trainer schedules, payment failures, and churn risk — simultaneously, every day.

The core problem: generic CRMs are designed for deal pipelines, not membership retention. A gym's business model is fundamentally subscription-based, where the biggest risk is not failing to acquire — it is quietly losing members who stop coming before their renewal date.

Generic tools do not show you that a member has not been in for 12 days and his renewal is in 8. They do not flag a medium churn risk based on attendance trends. They do not auto-send a re-engagement message when a member hits 7 days absent.

What gyms actually need: attendance-first dashboards, churn prediction before the cancellation happens, payment automation with smart retry logic, and trainer performance tracking — all in one place.

GrwFit was built after watching three gym clients manage their entire business in WhatsApp groups and spreadsheets.`,
  },
  {
    id: 8, tag: "Strategy",
    title:   "Brand before budget: why most small businesses advertise too early",
    excerpt: "Running ads on an unclear brand is expensive. Here is how to know if your brand is ready for paid traffic — and what to fix if it is not.",
    date: "Feb 22, 2026", readTime: "4 min",
    body: `We get calls every week from founders who have spent ₹80,000 on ads with almost nothing to show for it. When we audit the account, the ads are often fine. The problem is everything the ad points to — a website that does not explain what they do in 5 seconds, a value proposition that sounds like everyone else, and no social proof anywhere visible.

Ads amplify what is already there. If your brand is unclear, ads amplify the confusion. Paid traffic does not fix brand problems — it exposes them faster and at your expense.

The three-question brand audit. Before running a rupee of paid traffic, answer these in one sentence each: What do you do, and for whom specifically? Why should someone choose you over the two obvious alternatives? What happens after someone becomes a client?

If any of those take more than two sentences, the brand is not ready for paid traffic. Fix it first.

The minimum viable brand: a homepage that passes the 5-second test, one real testimonial with a specific result, and a clear next step.`,
  },
  {
    id: 9, tag: "AI",
    title:   "How we build travel itineraries in under 60 seconds with AI",
    excerpt: "The Lidflow AI itinerary builder went through six versions before it was fast and accurate enough to show clients. Here is what we learned.",
    date: "Feb 12, 2026", readTime: "4 min",
    body: `When we started building the AI itinerary feature for Lidflow, version one took 4 minutes to generate an itinerary and produced output needing 45 minutes of manual editing. By version six, it generates a customisable draft in under 60 seconds that agents edit for an average of 8 minutes.

The prompting problem. Early versions used generic prompts — the output was technically correct but felt like a Wikipedia summary. The breakthrough came when we structured the prompt around the client's specific preferences, budget signals, and the agency's own preferred supplier list. Specificity in equals specificity out.

The editing UX matters as much as the generation. Agents do not want a wall of generated text. They want a structured, section-by-section output they can click into and change in place.

The trust problem. Early agents were hesitant to send AI-generated itineraries to clients. We added a reviewed badge agents apply after checking the output — it gave them a quality-control moment that made them comfortable with the speed.

Result: agencies using Lidflow's itinerary builder handle 3x more inquiries with the same team size.`,
  },
  {
    id: 10, tag: "Growth",
    title:   "Lead generation for B2B services: what works in India in 2026",
    excerpt: "Cold outreach, LinkedIn, and referrals all work differently in the Indian B2B market. Here is what our data shows after 200+ campaigns.",
    date: "Feb 2, 2026", readTime: "5 min",
    body: `B2B lead generation in India has its own set of rules that most Western playbooks do not account for. WhatsApp is a professional communication channel. LinkedIn is growing but thin in tier-2 cities. After running campaigns across 50+ clients, here is what the data shows.

WhatsApp outreach converts at 3–5x cold email. The same message that gets a 4% reply rate on email gets a 15–20% reply rate on WhatsApp — if it is personal, brief, and comes from a recognised number. Bulk campaigns do not work; one-to-one messages from a real person do.

LinkedIn works best for enterprise, not SMB. Decision-makers at companies above 200 employees are reachable and responsive. Below that, most Indian SMB owners are not active enough on the platform to justify the CPL.

The referral multiplier is underused. Clients in India refer generously when asked directly and personally. A structured referral ask timed 30–60 days after a successful project milestone consistently generates 2–3 warm introductions per client.

Best-performing pipeline: warm LinkedIn content for awareness, WhatsApp for direct outreach, formalised referral system for existing clients.`,
  },
  {
    id: 11, tag: "Analytics",
    title:   "GA4 is broken for most businesses — here is how to fix it",
    excerpt: "The default GA4 setup misses 40–60% of conversions. These five configuration changes take under two hours and fix most of the data problems.",
    date: "Jan 22, 2026", readTime: "4 min",
    body: `When we audit GA4 for new clients, the same five problems appear almost every time. The default setup tracks pageviews reliably and almost everything else unreliably.

Conversion events are not set up. GA4 does not automatically track form submissions, phone call clicks, or WhatsApp link clicks. You need to configure these in Google Tag Manager and mark them as conversions in GA4.

Self-referral traffic is inflating sessions. If your site uses a payment gateway like Razorpay or CCAvenue, you are generating self-referral sessions that inflate traffic numbers and break attribution. Fix with a referral exclusion list in GA4 data stream settings.

Bot traffic is not filtered. Small Indian websites typically see 15–25% bot traffic that GA4 does not filter by default. Enable IP filtering and the internal traffic filter minimum.

Session timeout is wrong for your business. Default is 30 minutes. If you run long-form content, users reading for 45 minutes show up as two sessions. Adjust to 60 minutes.

Cross-domain tracking is missing. If your main site and a subdomain are part of the same funnel, cross-domain tracking must be configured or attribution breaks entirely.`,
  },
  {
    id: 12, tag: "Strategy",
    title:   "The 90-day growth sprint: from zero to traction",
    excerpt: "A clear, stage-by-stage breakdown of how we structure the first 90 days with a new client — and why the order of operations matters.",
    date: "Jan 12, 2026", readTime: "5 min",
    body: `The first 90 days with a new client determine whether the engagement generates real results or produces a lot of activity with limited impact. After working with 50+ growth-stage businesses, we have refined a sprint structure that consistently produces measurable traction by day 90.

Days 1–14: Foundation. No campaigns launch in week one. We audit what exists: GA4 configuration, ad account history, landing page conversion rates, and current customer LTV. Running campaigns on broken data is how budgets disappear without learning anything.

Days 15–30: The minimum viable funnel. One traffic source. One landing page. One conversion event. Properly tracked. A focused funnel generates clean data; a broad unfocused launch generates noise.

Days 31–60: Optimisation loop. With two to four weeks of data, the first optimisation decisions are made. Creative rotation, audience refinement, landing page A/B tests. One change at a time, measure before the next.

Days 61–90: Scale and diversify. The best-performing channel gets increased budget. A second channel launches using what was learned from the first. By day 90, the client has a working growth system — not just active campaigns.`,
  },
];

export default function BlogGrid() {
  const [active,   setActive]   = useState<string>("All");
  const [openPost, setOpenPost] = useState<Post | null>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") setOpenPost(null); },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    document.body.style.overflow = openPost ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openPost]);

  const filtered =
    active === "All" ? POSTS : POSTS.filter((p) => p.tag === active);

  return (
    <section className="blog-grid-section">

      {/* filter bar */}
      <div className="blog-filter-bar" role="group" aria-label="Filter posts by topic">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            aria-pressed={active === f}
            className={`blog-filter-btn${active === f ? " blog-filter-btn--active" : ""}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* grid */}
      <div className="blog-grid">
        {filtered.map((post) => (
          <article
            key={post.id}
            className="blog-card"
            onClick={() => setOpenPost(post)}
            onKeyDown={(e) => e.key === "Enter" && setOpenPost(post)}
            tabIndex={0}
            role="button"
            aria-label={`Read: ${post.title}`}
          >
            <div className="blog-card__top">
              <span className="blog-card__tag">{post.tag}</span>
              <span className="blog-card__time">{post.readTime}</span>
            </div>
            <h2 className="blog-card__title">{post.title}</h2>
            <p  className="blog-card__excerpt">{post.excerpt}</p>
            <div className="blog-card__footer">
              <span className="blog-card__date">{post.date}</span>
              <span className="blog-card__arrow" aria-hidden="true">→</span>
            </div>
          </article>
        ))}
      </div>

      {/* modal */}
      {openPost && (
        <div
          className="blog-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setOpenPost(null)}
          role="dialog"
          aria-modal="true"
          aria-label={openPost.title}
        >
          <div className="blog-modal">
            <button
              className="blog-modal__close"
              onClick={() => setOpenPost(null)}
              aria-label="Close article"
            >
              ✕
            </button>
            <div className="blog-modal__meta">
              <span className="blog-card__tag">{openPost.tag}</span>
              <span className="blog-card__time">{openPost.readTime} read</span>
            </div>
            <h2 className="blog-modal__title">{openPost.title}</h2>
            <div className="blog-modal__body">
              {openPost.body.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="blog-modal__footer">
              <span className="blog-card__date">{openPost.date}</span>
              <a href="/contact" className="blog-modal__cta">
                Work with us →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}