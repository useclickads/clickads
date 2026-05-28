import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/common/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ClickAds",
  description: "Privacy policy and data handling practices at ClickAds.",
  alternates: {
    canonical: "https://www.useclickads.com/privacy",
  },
};

export default function PrivacyPage() {
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
        "name": "Privacy Policy",
        "item": "https://www.useclickads.com/privacy"
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
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section>
            <h2>1. Introduction</h2>
            <p>
              ClickAds ("we," "us," "our," or "Company") respects your privacy and is committed to protecting your personal data.
              This privacy policy explains how we collect, use, disclose, and otherwise process your information in connection with our website,
              products, and services.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We collect information in the following ways:</p>
            <ul>
              <li><strong>Contact Form Data:</strong> When you submit our contact form, we collect your name, email address, phone number, company name, and project details.</li>
              <li><strong>Analytics Data:</strong> We use Google Analytics to collect usage data, including pages visited, time spent, browser type, and IP address.</li>
              <li><strong>Cookies:</strong> We use cookies to enhance your browsing experience and track website performance.</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To send you service-related updates and marketing communications (with your consent)</li>
              <li>To improve our website and services through analytics</li>
              <li>To comply with legal obligations</li>
              <li>To prevent fraud and enhance security</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Storage & Retention</h2>
            <p>
              We store your personal data on secure servers. Contact form submissions are retained for 12 months unless you request deletion.
              Analytics data is anonymized and retained for 26 months. You may request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2>5. Third-Party Services</h2>
            <p>
              We use the following third-party services that may process your data:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> For website traffic and user behavior analysis</li>
              <li><strong>Nodemailer:</strong> For sending transactional emails from your contact form</li>
              <li><strong>Gmail:</strong> For email delivery infrastructure</li>
            </ul>
            <p>
              These services have their own privacy policies. We encourage you to review them.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>
              <strong>For users in the EU (GDPR):</strong> You have the right to access, correct, delete, or export your personal data.
              You may also object to processing or request restriction of processing.
            </p>
            <p>
              <strong>For users in India (DPDP Act 2023):</strong> You have the right to access, correction, erasure, and portability of your data.
              You may also lodge a complaint with the relevant Data Protection Authority.
            </p>
            <p>
              To exercise these rights, contact us at <a href="mailto:contact@useclickads.com">contact@useclickads.com</a>.
            </p>
          </section>

          <section>
            <h2>7. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including SSL encryption, secure servers, and access controls.
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2>8. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience. You can control cookies through your browser settings.
              See our <a href="/cookies">Cookie Policy</a> for more details.
            </p>
          </section>

          <section>
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy periodically. We will notify you of material changes by posting the updated policy on our website
              with a new "Last Updated" date.
            </p>
          </section>

          <section>
            <h2>10. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or our data practices, please contact us at:
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
