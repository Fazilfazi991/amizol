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
        // Both JSON files contain the same products, so fetch only one
        // and pick a varied selection to show on homepage
        const res = await fetch('/littledubai-adidas.json');
        const data = await res.json();
        const products = (data.products || []).slice(0, 8).map((p: any) => ({ ...p, source: 'adidas' }));
        setNewArrivals(products);
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
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"
            alt="Little Dubai Hero"
            className="hero__image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="hero__overlay"></div>
        </div>
        <div className="hero__content">
          <h1 className="hero__title">ELEVATE YOUR STEP</h1>
          <p className="hero__subtitle">Discover the world's largest destination for luxury shoes, bags &amp; accessories.</p>
          <div className="hero__actions">
            <Link href="/category/women" className="btn btn--white">SHOP WOMEN</Link>
            <Link href="/category/men" className="btn btn--white">SHOP MEN</Link>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="section container">
        <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <Link href="/category/womens-watches" className="category-card">
            <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800" alt="Watches" className="category-card__image" />
            <div className="category-card__overlay"></div>
            <div className="category-card__content">
              <h2 className="category-card__title">WATCHES</h2>
              <p className="category-card__subtitle">Luxury Timepieces</p>
            </div>
          </Link>
          <Link href="/category/womens-bags" className="category-card">
            <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800" alt="Bags" className="category-card__image" />
            <div className="category-card__overlay"></div>
            <div className="category-card__content">
              <h2 className="category-card__title">BAGS</h2>
              <p className="category-card__subtitle">Designer Handbags</p>
            </div>
          </Link>
          <Link href="/category/wallets" className="category-card">
            <img src="https://images.unsplash.com/photo-1511405946472-a37e3b5ccd47?w=800" alt="Accessories" className="category-card__image" />
            <div className="category-card__overlay"></div>
            <div className="category-card__content">
              <h2 className="category-card__title">ACCESSORIES</h2>
              <p className="category-card__subtitle">Finishing Touches</p>
            </div>
          </Link>
          <Link href="/category/womens-slippers" className="category-card">
            <img src="https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800" alt="Slippers" className="category-card__image" />
            <div className="category-card__overlay"></div>
            <div className="category-card__content">
              <h2 className="category-card__title">SLIPPERS</h2>
              <p className="category-card__subtitle">Comfort & Style</p>
            </div>
          </Link>
          <Link href="/category/womens-shoes" className="category-card">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" alt="Shoes" className="category-card__image" />
            <div className="category-card__overlay"></div>
            <div className="category-card__content">
              <h2 className="category-card__title">SHOES</h2>
              <p className="category-card__subtitle">Signature Footwear</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Shop by Brand Section */}
      <section className="section container brands-section">
        <div className="section-header">
          <h2 className="section-title">SHOP BY BRAND</h2>
          <Link href="/brands" className="btn btn--ghost">
            View All Brands <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </Link>
        </div>
        <div className="brands-grid">
          {brands.map((brand) => (
            <Link 
              key={`${brand.slug}-${brand.name}`} 
              href={`/brands/${brand.slug}`} 
              className={`brand-item ${brand.active ? 'active' : ''}`}
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section container bg-tertiary">
        <div className="text-center mb-10">
          <h2 className="text-uppercase letter-spacing-wider section__title">NEW ARRIVALS</h2>
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
        <div className="text-center mt-12">
          <Link href="/category/new-arrivals" className="btn btn--secondary">VIEW ALL NEW IN</Link>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section p-0 overflow-hidden">
        <div className="home-story">
          <div className="home-story__image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop')" }}></div>
          <div className="home-story__content">
            <h2 className="text-4xl mb-6">THE WORLD'S LARGEST DESTINATION</h2>
            <p className="text-secondary mb-8">Little Dubai is the globally recognized retail concept and destination dedicated to the world of designer shoes for women, men, and kids.</p>
            <div>
              <Link href="/about" className="btn btn--primary">LEARN MORE</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

