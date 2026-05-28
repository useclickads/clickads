import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/common/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | ClickAds",
  description: "Information about cookies and similar tracking technologies used on ClickAds.",
  alternates: {
    canonical: "https://www.useclickads.com/cookies",
  },
};

export default function CookiesPage() {
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
        "name": "Cookie Policy",
        "item": "https://www.useclickads.com/cookies"
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
          <h1>Cookie Policy</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section>
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit our website. They help us remember your preferences,
              track your usage, and enhance your browsing experience. Cookies can be persistent (remain on your device) or session-based
              (deleted when you close your browser).
            </p>
          </section>

          <section>
            <h2>2. Types of Cookies We Use</h2>
            <p><strong>Essential Cookies:</strong></p>
            <ul>
              <li>Required for basic website functionality (e.g., navigation, form submission)</li>
              <li>Cannot be disabled without affecting site usability</li>
            </ul>
            <p><strong>Analytics Cookies:</strong></p>
            <ul>
              <li>Google Analytics: Tracks page views, user behavior, and traffic patterns</li>
              <li>Helps us understand how you use our website and improve our services</li>
            </ul>
            <p><strong>Marketing & Preference Cookies:</strong></p>
            <ul>
              <li>Remembers your preferences and settings</li>
              <li>May be used for retargeting if enabled</li>
            </ul>
          </section>

          <section>
            <h2>3. Third-Party Cookies</h2>
            <p>
              The following third parties may set cookies on our website:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> Tracks website traffic and user engagement</li>
              <li><strong>Google Tag Manager:</strong> Manages and deploys marketing tags</li>
              <li><strong>Social Media Platforms:</strong> May set cookies for social sharing features</li>
            </ul>
            <p>
              These third parties have their own privacy policies and cookie management practices.
            </p>
          </section>

          <section>
            <h2>4. Consent & Opt-Out</h2>
            <p>
              When you first visit our website, a cookie consent banner will appear asking for your consent.
              You can choose to:
            </p>
            <ul>
              <li><strong>Accept All:</strong> All cookies including analytics and marketing</li>
              <li><strong>Reject Non-Essential:</strong> Only essential cookies will be used</li>
              <li><strong>Manage Preferences:</strong> Customize which types of cookies to allow</li>
            </ul>
            <p>
              Your preference is saved in a cookie. You can change your cookie settings at any time by visiting this page.
            </p>
          </section>

          <section>
            <h2>5. Browser Controls</h2>
            <p>
              You can control cookies through your browser settings:
            </p>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
              <li><strong>Edge:</strong> Settings → Privacy → Cookies and other site permissions</li>
            </ul>
            <p>
              Please note that disabling cookies may affect your ability to use certain features of our website.
            </p>
          </section>

          <section>
            <h2>6. Do Not Track</h2>
            <p>
              If your browser has a "Do Not Track" (DNT) feature enabled, we respect that preference.
              Analytics cookies will not be set if you have DNT enabled.
            </p>
          </section>

          <section>
            <h2>7. Cookie Duration</h2>
            <p>
              Essential cookies are typically session-based and deleted when you close your browser.
              Analytics cookies are retained for up to 26 months. You can clear cookies manually at any time.
            </p>
          </section>

          <section>
            <h2>8. International Users</h2>
            <p>
              <strong>EU/EEA Users (GDPR):</strong> We only set non-essential cookies with your explicit consent.
            </p>
            <p>
              <strong>India Users (DPDP Act):</strong> We comply with data protection laws and provide clear opt-out options.
            </p>
            <p>
              <strong>Other Regions:</strong> We follow applicable privacy laws and provide transparent cookie management.
            </p>
          </section>

          <section>
            <h2>9. Data Security</h2>
            <p>
              Cookies are stored securely on your device. Sensitive data is encrypted and never stored in plain text.
            </p>
          </section>

          <section>
            <h2>10. Updates to This Policy</h2>
            <p>
              We may update this cookie policy as our website and services evolve. Changes will be posted with a new "Last Updated" date.
            </p>
          </section>

          <section>
            <h2>11. Contact Us</h2>
            <p>
              For questions about our cookie practices, please contact us at:
            </p>
            <address>
              ClickAds<br />
              Email: <a href="mailto:contact@useclickads.com">contact@useclickads.com</a><br />
              Phone: <a href="tel:+919334433557">+91-9334433557</a>
            </address>
            <p>
              For more information about our data practices, see our <a href="/privacy">Privacy Policy</a>.
            </p>
          </section>
        </div>
      </article>
      <Footer />
      </main>
    </>
  );
}
