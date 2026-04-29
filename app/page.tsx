'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [mensRes, womensRes] = await Promise.all([
          fetch('/littledubai-mens-shoes.json'),
          fetch('/littledubai-womens-shoes.json')
        ]);
        
        const mensData = await mensRes.json();
        const womensData = await womensRes.json();
        
        const mensProducts = (mensData.products || []).slice(0, 4).map((p: any) => ({ ...p, source: 'mens' }));
        const womensProducts = (womensData.products || []).slice(4, 8).map((p: any) => ({ ...p, source: 'womens' }));
        
        setNewArrivals([...mensProducts, ...womensProducts]);
      } catch (e) {
        console.error('Failed to fetch products', e);
      }
    }
    fetchData();
  }, []);

  const brands = [
    { name: 'Adidas', slug: 'adidas' },
    { name: 'New Balance', slug: 'new-balance' },
    { name: 'Gucci', slug: 'gucci' },
    { name: 'Louis Vuitton', slug: 'louis-vuitton' },
    { name: 'On Cloud', slug: 'on-cloud' },
    { name: 'Dior', slug: 'dior' },
    { name: 'Zegna', slug: 'zegna' },
    { name: 'Heels', slug: 'heels' },
    { name: 'Timberland', slug: 'timberland' },
    { name: 'Loro Piana', slug: 'loro-piana', active: true },
    { name: 'Hermes', slug: 'hermes' },
    { name: 'Alexander McQueen', slug: 'alexander-mcqueen' },
    { name: 'Prada', slug: 'prada' },
    { name: 'Balenciaga', slug: 'balenciaga' },
    { name: 'Amiri', slug: 'amiri' },
    { name: 'Travis Scott', slug: 'travis-scott' },
    { name: 'Golden Goose', slug: 'golden-goose' },
    { name: 'Christian Louboutin', slug: 'christian-louboutin' },
    { name: 'Dolce & Gabbana', slug: 'dolce-gabbana' },
    { name: 'Asics', slug: 'asics' },
    { name: 'Hoka', slug: 'hoka' },
    { name: 'Puma', slug: 'puma' },
    { name: 'Onitsuka Tiger', slug: 'onitsuka-tiger' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__background">
          <img 
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop" 
            alt="Luxury Shoes" 
            className="hero__image"
          />
          <div className="hero__overlay" style={{ background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }}></div>
        </div>
        <div className="hero__content">
          <h1 className="hero__title text-white">ELEVATE YOUR STEP</h1>
          <p className="hero__subtitle text-white text-lg max-w-xl mx-auto mb-10 opacity-100">
            Discover the world's largest destination for luxury shoes, bags &amp; accessories. Curated collections from the globe's most iconic designers.
          </p>
          <div className="hero__actions">
            <Link href="/category/women" className="btn btn--white btn--lg">SHOP WOMEN</Link>
            <Link href="/category/men" className="btn btn--white btn--lg">SHOP MEN</Link>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="section container">
        <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          <Link href="/category/womens-watches" className="category-card group">
            <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800" alt="Watches" className="category-card__image group-hover:scale-110 transition-transform duration-700" />
            <div className="category-card__overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}></div>
            <div className="category-card__content">
              <h2 className="category-card__title text-white">WATCHES</h2>
              <p className="category-card__subtitle text-white opacity-80">Luxury Timepieces</p>
            </div>
          </Link>
          <Link href="/category/womens-bags" className="category-card group">
            <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800" alt="Bags" className="category-card__image group-hover:scale-110 transition-transform duration-700" />
            <div className="category-card__overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}></div>
            <div className="category-card__content">
              <h2 className="category-card__title text-white">BAGS</h2>
              <p className="category-card__subtitle text-white opacity-80">Designer Handbags</p>
            </div>
          </Link>
          <Link href="/category/wallets" className="category-card group">
            <img src="https://images.unsplash.com/photo-1511405946472-a37e3b5ccd47?w=800" alt="Accessories" className="category-card__image group-hover:scale-110 transition-transform duration-700" />
            <div className="category-card__overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}></div>
            <div className="category-card__content">
              <h2 className="category-card__title text-white">ACCESSORIES</h2>
              <p className="category-card__subtitle text-white opacity-80">Finishing Touches</p>
            </div>
          </Link>
          <Link href="/category/womens-slippers" className="category-card group">
            <img src="https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800" alt="Slippers" className="category-card__image group-hover:scale-110 transition-transform duration-700" />
            <div className="category-card__overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}></div>
            <div className="category-card__content">
              <h2 className="category-card__title text-white">SLIPPERS</h2>
              <p className="category-card__subtitle text-white opacity-80">Comfort & Style</p>
            </div>
          </Link>
          <Link href="/category/womens-shoes" className="category-card group">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" alt="Shoes" className="category-card__image group-hover:scale-110 transition-transform duration-700" />
            <div className="category-card__overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}></div>
            <div className="category-card__content">
              <h2 className="category-card__title text-white">SHOES</h2>
              <p className="category-card__subtitle text-white opacity-80">Signature Footwear</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Shop by Brand Section */}
      <section className="section container brands-section">
        <div className="section-header flex justify-between items-center mb-10 pb-4 border-b border-light">
          <h2 className="section-title text-2xl font-semibold tracking-tight uppercase">SHOP BY BRAND</h2>
          <Link href="/brands" className="btn btn--ghost text-sm font-medium">
            View All Brands <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </Link>
        </div>
        <div className="brands-grid flex flex-wrap gap-x-12 gap-y-8 justify-center py-6">
          {brands.map((brand) => (
            <Link 
              key={`${brand.slug}-${brand.name}`} 
              href={`/brands/${brand.slug}`} 
              className={`brand-item text-sm font-medium tracking-wide uppercase hover:text-accent transition-colors ${brand.active ? 'text-accent' : 'text-secondary'}`}
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section container bg-tertiary">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display uppercase tracking-widest section__title">NEW ARRIVALS</h2>
        </div>
        <div className="product-grid">
          {newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <ProductCard 
                key={`${product.source}-${product.id}`} 
                product={{
                  id: product.id,
                  name: product.title || product.name,
                  brand: product.vendor || product.brandName || 'Designer',
                  price: product.price,
                  image: product.image_urls?.[0] || product.images?.[0] || '/images/placeholder.png',
                  source: product.source
                }} 
              />
            ))
          ) : (
            // Skeleton loading state
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="product-card">
                <div className="skeleton skeleton--image" style={{ width: '100%', aspectRatio: '1/1' }}></div>
                <div className="product-card__info">
                  <div className="skeleton skeleton--text" style={{ width: '40%', marginBottom: '0.5rem' }}></div>
                  <div className="skeleton skeleton--text" style={{ width: '90%', marginBottom: '0.5rem' }}></div>
                  <div className="skeleton skeleton--text" style={{ width: '30%' }}></div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center mt-20">
          <Link href="/category/new-arrivals" className="btn btn--secondary btn--lg px-12">VIEW ALL NEW IN</Link>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section bg-white">
        <div className="container">
          <div className="home-story bg-tertiary shadow-sm overflow-hidden" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div className="home-story__image h-[500px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div className="home-story__content p-12 flex flex-col justify-center">
              <h2 className="text-4xl font-display mb-6 tracking-tight">THE WORLD'S LARGEST DESTINATION</h2>
              <p className="text-secondary text-lg leading-relaxed mb-8">Little Dubai is the globally recognized retail concept and destination dedicated to the world of designer shoes for women, men, and kids.</p>
              <div>
                <Link href="/about" className="btn btn--primary btn--lg">LEARN OUR STORY</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

