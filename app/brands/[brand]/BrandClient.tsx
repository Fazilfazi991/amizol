'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/products/ProductCard';
import Image from 'next/image';
import { getProductMainImage } from '@/lib/image-helper';

interface Props {
  brandSlug: string;
  initialProducts: any[];
}

const BRAND_HERO_MAP: Record<string, string> = {
  gucci: '/images/gucci-l.jpg',
  prada: '/images/prada-l.jpg',
  dior: '/images/dior-l.jpg',
  'louis-vuitton': '/images/louis-vuitton-l.jpg',
  balenciaga: '/images/balenciaga_hero.png',
  hermes: '/images/hermes-l.jpg',
  amiri: '/images/amiri-l.jpg',
  'dolce-gabbana': '/images/dolce-gabbana-l.jpg',
  'loro-piana': '/images/loro-piana-l.jpg',
  'christian-louboutin': '/images/christian-louboutin-l.jpg',
  'travis-scott': '/images/travis-scott-l.jpg',
  zegna: '/images/zegna-l.jpg',
  'alexander-mcqueen': '/images/alexander-mcqueen-l.jpg',
  nike: '/images/nike-l.jpg',
  adidas: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80',
  'new-balance': '/images/new-balance-l.jpg',
  hoka: '/images/hoka-l.jpg',
  'on-cloud': '/images/on-cloud-l.jpg',
  'golden-goose': '/images/golden-goose-l.jpg',
  asics: '/images/asics-l.jpg',
  puma: '/images/puma-l.jpg',
  timberland: '/images/timberland-l.jpg',
  'onitsuka-tiger': '/images/onitsuka-tiger-l.jpg',
};

const BRAND_MOBILE_HERO_MAP: Record<string, string> = {
  gucci: '/images/gucci-m.png',
  prada: '/images/prada-m.png',
  hermes: '/images/hermes-m.png',
  'loro-piana': '/images/loro-piana-m.png',
  'christian-louboutin': '/images/christian-louboutin-m.png',
  'travis-scott': '/images/travis-scott-m.png',
  nike: '/images/nike-m.png',
  hoka: '/images/hoka-m.png',
  'on-cloud': '/images/on-cloud-m.png',
};

export default function BrandClient({ brandSlug, initialProducts }: Props) {
  const [sortBy, setSortBy] = useState('featured');
  const brandName = brandSlug.replace(/-/g, ' ').toUpperCase();
  const heroImage = BRAND_HERO_MAP[brandSlug] ?? '/images/general_hero.png';
  const mobileHeroImage = BRAND_MOBILE_HERO_MAP[brandSlug];

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
      <header className="page-header page-header--lg relative h-[500px] overflow-hidden flex items-center justify-center bg-black">
        {mobileHeroImage ? (
          <>
            <div className="hidden md:block absolute inset-0 bg-black">
              <Image
                src={heroImage}
                alt={brandName}
                fill
                className="object-contain"
                priority
                unoptimized={true}
                onError={(e: any) => {
                  e.target.src = '/images/general_hero.png';
                }}
              />
            </div>
            <div className="md:hidden absolute inset-0 bg-black">
              <Image
                src={mobileHeroImage}
                alt={brandName}
                fill
                className="object-contain"
                priority
                unoptimized={true}
                onError={(e: any) => {
                  e.target.src = '/images/general_hero.png';
                }}
              />
            </div>
          </>
        ) : (
          <Image
            src={heroImage}
            alt={brandName}
            fill
            className="object-contain"
            priority
            unoptimized={true}
            onError={(e: any) => {
              e.target.src = '/images/general_hero.png';
            }}
          />
        )}
        <div className="page-header__overlay absolute inset-0 bg-black/40"></div>
        <div className="container page-header__content relative z-10 text-center text-white">
          <h1 className="page-header__title text-5xl font-display mb-4 tracking-widest">{brandName}</h1>
          <p className="page-header__subtitle text-xl font-light opacity-90">Explore the exclusive collection from {brandName}</p>
        </div>
      </header>

      <div className="container py-12 border-b border-light">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-accent rounded-full"></span>
             <span className="text-secondary text-sm font-medium tracking-wide uppercase">{sortedProducts.length} Products Found</span>
          </div>
          <div className="sort-container flex items-center gap-4">
            <label className="text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">SORT BY:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select text-sm bg-transparent border-b border-secondary/30 pb-1 pr-8 focus:border-accent transition-colors"
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
                    image: getProductMainImage(product),
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
