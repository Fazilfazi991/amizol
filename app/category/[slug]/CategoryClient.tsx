'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  slug: string;
  initialConfig: any;
  initialProducts: any[];
}

const MEN_LINKS = [
  { href: '/category/mens-shoes', label: "Men's Shoes" },
  { href: '/category/mens-slippers', label: "Men's Slippers" },
  { href: '/category/mens-watches', label: "Men's Watches" },
  { href: '/category/mens-bags', label: "Men's Bags" },
];
const WOMEN_LINKS = [
  { href: '/category/womens-shoes', label: "Women's Shoes" },
  { href: '/category/womens-slippers', label: "Women's Slippers" },
  { href: '/category/womens-watches', label: "Women's Watches" },
  { href: '/category/womens-bags', label: "Women's Bags" },
];

export default function CategoryClient({ slug, initialConfig, initialProducts }: Props) {
  const [sortBy, setSortBy] = useState('featured');

  const categoryTitle = initialConfig?.title ?? slug.replace(/-/g, ' ').toUpperCase();
  const heroImage = initialConfig?.hero ?? '/images/general_luxury_hero.png';
  const isGenderPage = slug === 'men' || slug === 'women';
  const subLinks = slug === 'men' ? MEN_LINKS : slug === 'women' ? WOMEN_LINKS : [];

  const sortedProducts = useMemo(() => {
    let result = [...initialProducts];
    
    if (slug === 'new-arrivals') {
      const mensItems = result.filter((p) => p.source === 'mens').slice(0, 8);
      const womensItems = result.filter((p) => p.source === 'womens').slice(0, 8);
      result = [...mensItems, ...womensItems];
    }

    if (sortBy === 'price-low-high') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }
    
    return result;
  }, [initialProducts, sortBy, slug]);

  return (
    <div>
      <header className="page-header" style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="page-header__overlay"></div>
        <div className="container page-header__content" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="page-header__title">{categoryTitle}</h1>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex gap-4">
            {isGenderPage && subLinks.map((link) => (
              <Link key={link.href} href={link.href} className="btn btn--secondary btn--sm">
                {link.label}
              </Link>
            ))}
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
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 w-full">
            <p className="text-muted">No products found in this category.</p>
          </div>
        ) : (
          <div className="product-grid">
            {sortedProducts.map((product) => (
              <ProductCard
                key={`${product.source}-${product.id}`}
                product={{
                  id: product.id,
                  name: product.title || product.name,
                  brand: product.vendor || product.brandName || 'Designer',
                  price: product.price,
                  image: product.image_urls?.[0] || product.images?.[0] || '/images/placeholder.png',
                  source: product.source,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
