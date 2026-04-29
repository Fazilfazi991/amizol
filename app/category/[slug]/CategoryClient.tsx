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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Reset page when sortBy or slug changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, slug]);

  return (
    <div>
      <header className="page-header relative h-[450px] overflow-hidden flex items-center justify-center">
        <Image 
          src={heroImage} 
          alt={categoryTitle} 
          fill 
          className="object-cover" 
          priority
          onError={(e: any) => {
            e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop';
          }}
        />
        <div className="page-header__overlay absolute inset-0 bg-black/40"></div>
        <div className="container page-header__content relative z-10 text-center text-white">
          <h1 className="page-header__title text-5xl font-display mb-2 tracking-widest">{categoryTitle}</h1>
          <p className="page-header__subtitle text-lg font-light opacity-80 uppercase tracking-widest">Premium Collection</p>
        </div>
      </header>

      <div className="container py-12 border-b border-light">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {isGenderPage && subLinks.map((link) => (
              <Link key={link.href} href={link.href} className="btn btn--secondary btn--sm px-6">
                {link.label}
              </Link>
            ))}
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
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-20 w-full">
            <p className="text-muted">No products found in this category.</p>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {paginatedProducts.map((product) => (
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
        )}
      </section>
    </div>
  );
}
