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
  adidas: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80',
  'new-balance': 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80',
  hoka: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80',
  'on-cloud': 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
  'golden-goose': 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=800&q=80',
  asics: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80',
  puma: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
  timberland: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80',
  'onitsuka-tiger': 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
};

export default function BrandClient({ brandSlug, initialProducts }: Props) {
  const [sortBy, setSortBy] = useState('featured');
  const brandName = brandSlug.replace(/-/g, ' ').toUpperCase();
  const heroImage = BRAND_HERO_MAP[brandSlug] ?? '/images/general_hero.png';

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Reset page when sortBy changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  return (
    <div>
      <header className="page-header page-header--lg" style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
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
        {paginatedProducts.length > 0 ? (
          <>
            <div className="product-grid">
              {paginatedProducts.map((product) => (
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
            
            {totalPages > 1 && (
              <div className="pagination mt-16 flex justify-center items-center gap-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '4rem' }}>
                <button 
                  className="btn btn--secondary btn--sm" 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => prev - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  PREVIOUS
                </button>
                
                <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`btn btn--sm ${currentPage === page ? 'btn--primary' : 'btn--secondary'}`}
                      style={{ minWidth: '40px' }}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button 
                  className="btn btn--secondary btn--sm" 
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 w-full col-span-full">
            <p className="text-muted">No products found for this brand yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
