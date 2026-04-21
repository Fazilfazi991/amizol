'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const categoryTitle = (slug as string).replace(/-/g, ' ').toUpperCase();

  useEffect(() => {
    async function fetchData() {
      try {
        const sourceFile = (slug as string).includes('women') ? '/littledubai-womens.json' : '/littledubai-mens.json';
        const res = await fetch(sourceFile);
        const data = await res.json();
        
        let filtered = data.products.map((p: any) => ({ ...p, source: (slug as string).includes('women') ? 'womens' : 'mens' }));
        
        // Filter by specific sub-category if needed
        if ((slug as string).includes('shoes')) {
           filtered = filtered.filter((p: any) => p.title.toLowerCase().includes('shoe') || p.title.toLowerCase().includes('sneaker'));
        } else if ((slug as string).includes('bags')) {
           filtered = filtered.filter((p: any) => p.title.toLowerCase().includes('bag'));
        }
        
        setProducts(filtered);
      } catch (e) {
        console.error("Failed to fetch products", e);
      }
    }
    fetchData();
  }, [slug]);

  // Map category to hero image
  const heroImage = (slug as string).includes('women') ? '/images/womens_shoes_hero.png' : '/images/mens_shoes_hero.png';

  return (
    <div>
      <header className="page-header">
        <img src={heroImage} alt={categoryTitle} className="page-header__image" />
        <div className="page-header__overlay"></div>
        <div className="container page-header__content">
           <h1 className="page-header__title">{categoryTitle}</h1>
        </div>
      </header>

      <section className="section container">
        <div className="product-grid">
          {products.map((product) => (
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
