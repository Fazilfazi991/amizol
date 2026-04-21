'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';

export default function BrandPage() {
  const { brand } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const brandName = (brand as string).replace(/-/g, ' ').toUpperCase();

  useEffect(() => {
    async function fetchData() {
      try {
        const [mensRes, womensRes] = await Promise.all([
          fetch('/littledubai-mens.json'),
          fetch('/littledubai-womens.json')
        ]);
        const mensData = await mensRes.json();
        const womensData = await womensRes.json();
        
        const allProducts = [
          ...mensData.products.map((p: any) => ({ ...p, source: 'mens' })),
          ...womensData.products.map((p: any) => ({ ...p, source: 'womens' }))
        ];
        
        const filtered = allProducts.filter((p: any) => 
          (p.vendor || p.brandName || '').toLowerCase().includes((brand as string).replace(/-/g, ' '))
        );
        
        setProducts(filtered);
      } catch (e) {
        console.error("Failed to fetch products", e);
      }
    }
    fetchData();
  }, [brand]);

  // Map brand to hero image
  const heroImage = `/images/${(brand as string).replace(/-/g, '')}_hero.png`;

  return (
    <div>
      <header className="page-header page-header--lg">
        <img 
          src={heroImage} 
          alt={brandName} 
          className="page-header__image" 
          onError={(e) => (e.currentTarget.src = '/images/general_luxury_hero.png')} 
        />
        <div className="page-header__overlay"></div>
        <div className="container page-header__content">
           <h1 className="page-header__title">{brandName}</h1>
           <p className="page-header__subtitle">Explore the latest collection from {brandName}</p>
        </div>
      </header>

      <section className="section container">
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  id: product.id,
                  name: product.title || product.name,
                  brand: product.vendor || product.brandName || brandName,
                  price: product.price,
                  image: product.image_urls?.[0] || product.images?.[0] || '/images/placeholder.png',
                  source: product.source
                }} 
              />
            ))
          ) : (
            <div className="text-center py-20 w-full col-span-full">
              <p className="text-muted">No products found for this brand yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
