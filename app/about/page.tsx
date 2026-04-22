import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Little Dubai | The World\'s Largest Luxury Shoe Destination',
  description: 'Learn about Little Dubai — the globally recognized retail concept dedicated to designer shoes for women, men, and kids. Premium luxury with express delivery across UAE.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="section text-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
        <div style={{ position: 'relative', zIndex: 1, color: '#fff', maxWidth: '700px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            THE WORLD'S LARGEST DESTINATION
          </h1>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.7, opacity: 0.9 }}>
            Little Dubai is the globally recognized retail concept dedicated to the world of designer shoes, bags, and accessories for women, men, and kids.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '0.05em' }}>OUR STORY</h2>
            <p className="text-secondary" style={{ lineHeight: 1.8, marginBottom: '1rem' }}>
              Little Dubai was founded with one mission: to bring the world's finest footwear and luxury accessories to customers across the UAE and beyond. What began as a passion for authentic luxury goods has grown into the region's most trusted destination for designer footwear.
            </p>
            <p className="text-secondary" style={{ lineHeight: 1.8, marginBottom: '1rem' }}>
              We partner directly with the world's most prestigious brands — from Gucci and Louis Vuitton to Adidas and New Balance — to bring you guaranteed authentic products at competitive prices, delivered to your door within 24–48 hours.
            </p>
            <p className="text-secondary" style={{ lineHeight: 1.8 }}>
              With thousands of styles across hundreds of brands, Little Dubai is where luxury meets convenience.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { value: '500+', label: 'Brands' },
              { value: '10K+', label: 'Products' },
              { value: '24–48h', label: 'Delivery' },
              { value: '100%', label: 'Authentic' },
            ].map((stat) => (
              <div key={stat.label} style={{ background: 'var(--color-bg-secondary)', padding: '2rem', textAlign: 'center', borderRadius: '4px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', letterSpacing: '0.1em', opacity: 0.6, textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Little Dubai */}
      <section className="section bg-secondary">
        <div className="container">
          <h2 className="text-center" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '3rem' }}>WHY LITTLE DUBAI?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '✓', title: '100% Authentic', desc: 'Every product is sourced directly from authorized brand distributors.' },
              { icon: '🚚', title: 'Express Delivery', desc: 'Free express delivery within 24–48 hours across the UAE.' },
              { icon: '↩', title: 'Easy Returns', desc: '30-day hassle-free returns and exchanges on all orders.' },
              { icon: '💳', title: 'Cash on Delivery', desc: 'Pay only when you receive your order, no upfront payment required.' },
            ].map((item) => (
              <div key={item.title} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem', letterSpacing: '0.05em' }}>{item.title}</h3>
                <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center container">
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>START SHOPPING</h2>
        <p className="text-secondary" style={{ marginBottom: '2rem' }}>Explore thousands of authentic luxury products, delivered to your door.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/category/men" className="btn btn--primary">SHOP MEN</Link>
          <Link href="/category/women" className="btn btn--secondary">SHOP WOMEN</Link>
        </div>
      </section>
    </div>
  );
}
