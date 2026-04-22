'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/products/ProductCard';
import Image from 'next/image';

interface Props {
  brandSlug: string;
  initialProducts: any[];
}

const BRAND_HERO_MAP: Record<string, string> = {
  gucci: '/images/gucci_hero.png',
  prada: '/images/prada_hero.png',
  dior: '/images/dior_hero.png',
  'louis-vuitton': '/images/lv_hero.png',
  balenciaga: '/images/balenciaga_hero.png',
  hermes: '/images/hermes_hero.png',
  amiri: '/images/amiri_hero.png',
  'dolce-gabbana': '/images/dg_hero.png',
  'loro-piana': '/images/loropiana_hero.png',
  'christian-louboutin': '/images/louboutin_hero.png',
  'travis-scott': '/images/travis_hero.png',
  zegna: '/images/zegna_hero.png',
  'alexander-mcqueen': '/images/mcqueen_hero.png',
};

export default function BrandClient({ brandSlug, initialProducts }: Props) {
  const [sortBy, setSortBy] = useState('featured');
  const brandName = brandSlug.replace(/-/g, ' ').toUpperCase();
  const heroImage = BRAND_HERO_MAP[brandSlug] ?? '/images/general_luxury_hero.png';

  const sortedProducts = useMemo(() => {
    let result = [...initialProducts];
    if (sortBy === 'price-low-high') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }
    return result;
  }, [initialProducts, sortBy]);

  return (
    <div>
      <header className="page-header page-header--lg" style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
        <Image
          src={heroImage}
          alt={brandName}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="page-header__overlay"></div>
        <div className="container page-header__content" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="page-header__title">{brandName}</h1>
          <p className="page-header__subtitle">Explore the latest collection from {brandName}</p>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
             <span className="text-secondary text-sm">{sortedProducts.length} Products</span>
          </div>
          <div className="sort-container">
            <label className="text-xs font-bold mr-2">SORT BY:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select text-sm"
              style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <section className="section container">
        {sortedProducts.length > 0 ? (
          <div className="product-grid">
            {sortedProducts.map((product) => (
              <ProductCard
                key={`${product.source}-${product.id}`}
                product={{
                  id: product.id,
                  name: product.title || product.name,
                  brand: product.vendor || product.brandName || brandName,
                  price: product.price,
                  image: product.image_urls?.[0] || product.images?.[0] || '/images/placeholder.png',
                  source: product.source,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 w-full col-span-full">
            <p className="text-muted">No products found for this brand yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
