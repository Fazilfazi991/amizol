'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [mensRes, womensRes] = await Promise.all([
          fetch('/littledubai-mens.json'),
          fetch('/littledubai-womens.json')
        ]);
        const mensData = await mensRes.json();
        const womensData = await womensRes.json();
        
        const combined = [
          ...mensData.products.slice(0, 4).map((p: any) => ({ ...p, source: 'mens' })),
          ...womensData.products.slice(0, 4).map((p: any) => ({ ...p, source: 'womens' }))
        ];
        
        setNewArrivals(combined);
      } catch (e) {
        console.error("Failed to fetch products", e);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__video-container">
           <img src="/images/general_luxury_hero.png" alt="Luxury Fashion" className="hero__image" />
           <div className="hero__overlay"></div>
        </div>
        <div className="hero__content container">
           <p className="hero__subtitle">ELEVATED LUXURY</p>
           <h1 className="hero__title">THE WORLD'S LARGEST<br />SHOE DESTINATION</h1>
           <div className="hero__actions">
              <Link href="/category/men" className="btn btn--primary btn--lg">SHOP MEN</Link>
              <Link href="/category/women" className="btn btn--secondary btn--lg">SHOP WOMEN</Link>
           </div>
        </div>
      </section>

      {/* Brand Grid */}
      <section className="section container">
        <h2 className="section__title">SHOP BY BRAND</h2>
        <div className="brand-grid">
           <Link href="/brands/gucci" className="brand-card">
              <img src="/images/gucci_hero.png" alt="Gucci" />
              <span>GUCCI</span>
           </Link>
           <Link href="/brands/prada" className="brand-card">
              <img src="/images/prada_hero.png" alt="Prada" />
              <span>PRADA</span>
           </Link>
           <Link href="/brands/dior" className="brand-card">
              <img src="/images/dior_hero.png" alt="Dior" />
              <span>DIOR</span>
           </Link>
           <Link href="/brands/louis-vuitton" className="brand-card">
              <img src="/images/lv_hero.png" alt="Louis Vuitton" />
              <span>LOUIS VUITTON</span>
           </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section container">
        <div className="section__header">
           <h2 className="section__title">NEW ARRIVALS</h2>
           <Link href="/category/new-arrivals" className="text-link">VIEW ALL</Link>
        </div>
        <div className="product-grid">
          {newArrivals.map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                id: product.id,
                name: product.title || product.name,
                brand: product.vendor || product.brandName || 'Designer',
                price: product.price,
                image: product.image_urls?.[0] || product.images?.[0] || '/images/placeholder.png',
                source: product.source
              }} 
            />
          ))}
        </div>
      </section>
    </div>
  );
}
