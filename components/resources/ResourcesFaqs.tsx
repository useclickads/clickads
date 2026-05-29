"use client";
import { useEffect, useRef, useState } from "react";
import "@/styles/resources/Resources.css";

const faqs = [
  {
    q: "What is ClickAds and who is it for?",
    a: "ClickAds is a smarter advertising platform built for brands that want to grow faster and spend better. It's designed for startups, scale-ups, and enterprises alike.",
  },
  {
    q: "How do I get started with ClickAds?",
    a: "Simply create an account, connect your brand assets, and follow the getting started guide in our documentation. You can launch your first campaign in under 30 minutes.",
  },
  {
    q: "What ad platforms does ClickAds support?",
    a: "ClickAds supports all major ad platforms including Google, Meta, LinkedIn, and more. Check our Integrations documentation for the full list.",
  },
  {
    q: "Can I track performance across multiple campaigns?",
    a: "Yes. The ClickAds dashboard gives you a unified view of all your campaigns, budgets, and performance metrics in one place.",
  },
  {
    q: "Is there a free trial available?",
    a: "Yes. You can explore ClickAds with a free trial before committing to a plan. Visit our Pricing page for full details.",
  },
  {
    q: "How do I contact support?",
    a: "You can reach our team via the Contact page. We typically respond within 24 hours on business days.",
  },
];

export default function ResourcesFaqs() {
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="faqs" ref={ref} className="rs-section">
      <div className="rs-wrap">
        <div className={`rs-fade ${visible ? "rs-fade--visible" : ""}`}>
          <p className="rs-section-eyebrow">FAQs</p>
          <h2 className="rs-section-title">Frequently Asked Questions.</h2>
          <p className="rs-section-sub">
            Quick answers to the questions we hear most often.
          </p>
        </div>
        <div className="rs-faq-list">
          {faqs.map((item, i) => (
            <div key={i} className="rs-faq-item">
              <button
                className="rs-faq-btn"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-label={`${openIndex === i ? "Hide" : "Show"} answer: ${item.q}`}
              >
                <span className="rs-faq-q">{item.q}</span>
                <i className={`rs-faq-icon ${openIndex === i ? "rs-faq-icon--open" : ""}`}>+</i>
              </button>
              <div className={`rs-faq-answer ${openIndex === i ? "rs-faq-answer--open" : ""}`}>
                <p className="rs-faq-answer-inner">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}