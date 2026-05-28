import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/common/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ClickAds",
  description: "Terms of service and legal agreement for ClickAds services.",
  alternates: {
    canonical: "https://www.useclickads.com/terms",
  },
};

export default function TermsPage() {
  const breadcrumbSchema = {
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
        "name": "Terms of Service",
        "item": "https://www.useclickads.com/terms"
      }
    ]
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <main id="main-content">
        <Navbar />
      <article className="legal-page">
        <div className="legal-container">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the ClickAds website, products, and services, you agree to be bound by these Terms of Service.
              If you do not agree to any part of these terms, you may not use our services.
            </p>
          </section>

          <section>
            <h2>2. Services Provided</h2>
            <p>
              ClickAds provides AI marketing, SaaS development, web development, automation, lead generation, performance advertising,
              analytics, and brand design services. The scope of services will be defined in individual service agreements or project proposals.
            </p>
          </section>

          <section>
            <h2>3. Payment Terms</h2>
            <p>
              Payment terms will be outlined in individual service agreements. Invoices are due within the specified timeframe.
              Late payments may result in suspension of services. We reserve the right to decline future services if payment is not received.
            </p>
          </section>

          <section>
            <h2>4. Refund Policy</h2>
            <p>
              Refunds are handled on a case-by-case basis and will be specified in individual service agreements.
              Requests for refunds must be submitted within 30 days of service completion.
              ClickAds reserves the right to deduct costs incurred in providing services.
            </p>
          </section>

          <section>
            <h2>5. Intellectual Property Rights</h2>
            <p>
              Unless otherwise specified in a service agreement:
            </p>
            <ul>
              <li>ClickAds retains ownership of all tools, processes, and methodologies developed independently.</li>
              <li>Deliverables created specifically for you will be owned by you upon full payment.</li>
              <li>You grant ClickAds the right to use project work as a portfolio case study (with confidentiality considerations).</li>
            </ul>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, ClickAds shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages arising from your use of our services, even if we have been advised of the possibility of such damages.
              Our total liability shall not exceed the amount paid for the services in question.
            </p>
          </section>

          <section>
            <h2>7. Disclaimer of Warranties</h2>
            <p>
              Our services are provided on an "as-is" basis. We make no warranties, express or implied, regarding the results of our services.
              We do not guarantee specific outcomes, revenue increases, or performance metrics.
            </p>
          </section>

          <section>
            <h2>8. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential any proprietary information shared during the engagement.
              This includes client data, strategies, financial information, and trade secrets.
              Confidentiality obligations survive termination of the agreement.
            </p>
          </section>

          <section>
            <h2>9. Termination</h2>
            <p>
              Either party may terminate the service agreement with written notice. Terms for early termination will be specified in individual agreements.
              Upon termination, outstanding invoices remain payable.
            </p>
          </section>

          <section>
            <h2>10. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of Jharkhand, India,
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>11. Dispute Resolution</h2>
            <p>
              Any dispute arising from these terms or our services shall first be attempted to be resolved through good-faith negotiation.
              If negotiation fails, disputes shall be subject to the exclusive jurisdiction of courts in Jharkhand, India.
            </p>
          </section>

          <section>
            <h2>12. Severability</h2>
            <p>
              If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section>
            <h2>13. Entire Agreement</h2>
            <p>
              These Terms of Service, along with any individual service agreements, constitute the entire agreement between you and ClickAds
              regarding your use of our services and supersede all prior agreements.
            </p>
          </section>

          <section>
            <h2>14. Contact Us</h2>
            <p>
              For questions about these terms or to report violations, please contact us at:
            </p>
            <address>
              ClickAds<br />
              Email: <a href="mailto:contact@useclickads.com">contact@useclickads.com</a><br />
              Phone: <a href="tel:+919334433557">+91-9334433557</a>
            </address>
          </section>
        </div>
      </article>
      <Footer />
      </main>
    </>
  );
}
