'use client';

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode, Suspense } from "react";

function SignupContent() {
  const searchParams = useSearchParams();
  const product = searchParams.get('product') || 'lidflow';
  const isLidflow = product === 'lidflow';
  
  const productName = isLidflow ? 'Lidflow' : 'GrwFit';
  const productDesc = isLidflow 
    ? 'Lead management and CRM for travel agencies'
    : 'Member management and payment automation for gyms';

  return (
    <section style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Start Your Free Trial
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#999', marginBottom: '1rem' }}>
          {productName}
        </p>
        <p style={{ fontSize: '1rem', color: '#ccc', marginBottom: '2rem', lineHeight: 1.6 }}>
          {productDesc}
        </p>

        <div style={{
          background: 'rgba(124, 58, 237, 0.1)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
        }}>
          <p style={{ marginBottom: '1rem', color: '#e5e5e5' }}>
            ✓ 14-day free trial<br />
            ✓ No credit card required<br />
            ✓ Full feature access<br />
            ✓ Premium support included
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              alert('Sign up functionality coming soon. Please contact us at contact@useclickads.com to request early access.');
            }}
            style={{
              padding: '12px 32px',
              background: '#7c3aed',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Start Free Trial
          </button>
          <Link
            href="/contact"
            style={{
              padding: '12px 32px',
              background: 'transparent',
              color: '#7c3aed',
              border: '1px solid #7c3aed',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Contact Sales
          </Link>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
          Questions? <Link href="/contact" style={{ color: '#7c3aed', textDecoration: 'none' }}>Get in touch with our team</Link>
        </p>
      </div>
    </section>
  );
}

function SignupFallback() {
  return (
    <section style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Start Your Free Trial
        </h1>
        <p style={{ color: '#999' }}>Loading...</p>
      </div>
    </section>
  );
}

export default function SignupPage() {
  return (
    <main id="main-content">
      <Navbar />
      <Suspense fallback={<SignupFallback />}>
        <SignupContent />
      </Suspense>
      <Footer />
    </main>
  );
}
