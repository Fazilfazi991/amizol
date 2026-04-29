import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Little Dubai | The World\'s Largest Luxury Shoe Destination',
  description: 'Learn about Little Dubai — the globally recognized retail concept dedicated to designer shoes for women, men, and kids. Premium luxury with express delivery across UAE.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Retail" 
          fill 
          className="object-cover" 
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-display mb-6 tracking-tight">THE WORLD'S LARGEST DESTINATION</h1>
          <p className="text-xl font-light tracking-wide max-w-2xl mx-auto opacity-90">Redefining luxury retail in the heart of Dubai.</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-accent uppercase tracking-widest font-semibold text-sm mb-4 block">Our Story</span>
            <h2 className="text-4xl font-display mb-8">AUTHENTICITY & LUXURY</h2>
            <div className="space-y-6 text-secondary text-lg leading-relaxed">
              <p>Founded with a vision to bring the world's most exclusive footwear to the Middle East, Little Dubai has grown into a global retail landmark.</p>
              <p>We pride ourselves on curating a collection that transcends trends, focusing on timeless craftsmanship and the avant-garde spirit of modern luxury.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: '500+', label: 'Brands' },
              { value: '10K+', label: 'Products' },
              { value: '24–48h', label: 'Delivery' },
              { value: '100%', label: 'Authentic' },
            ].map((stat) => (
              <div key={stat.label} className="p-8 bg-tertiary text-center border border-light shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl font-display mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-secondary font-bold">{stat.label}</div>
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
