'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    async function performSearch() {
      setLoading(true);
      try {
        const sources = [
          'littledubai-mens-shoes.json',
          'littledubai-womens-shoes.json',
          'littledubai-mens-slippers.json',
          'littledubai-womens-slippers1.json',
          'littledubai-gucci.json',
          'littledubai-louis-vuitton.json'
        ];

        const allResults: any[] = [];
        
        for (const source of sources) {
          const res = await fetch(`/${source}`);
          if (!res.ok) continue;
          const data = await res.json();
          const items = (data.products || []).filter((p: any) => {
            const searchStr = `${p.title} ${p.vendor} ${p.product_type} ${p.brandName}`.toLowerCase();
            return searchStr.includes(query.toLowerCase());
          }).map((p: any) => ({
            ...p,
            source: source.replace('littledubai-', '').replace('.json', '')
          }));
          allResults.push(...items);
        }

        // De-duplicate by ID
        const unique = Array.from(new Map(allResults.map(item => [item.id, item])).values());
        setResults(unique);
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [query]);

  return (
    <div className="container section">
      <div className="search-header mb-12">
        <h1 className="text-2xl font-bold">SEARCH RESULTS</h1>
        <p className="text-secondary">
          {loading ? 'Searching...' : `${results.length} results found for "${query}"`}
        </p>
      </div>

      {loading ? (
        <div className="product-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="product-card">
              <div className="skeleton skeleton--image" style={{ width: '100%', aspectRatio: '1/1' }}></div>
              <div className="product-card__info">
                <div className="skeleton skeleton--text" style={{ width: '40%', marginBottom: '0.5rem' }}></div>
                <div className="skeleton skeleton--text" style={{ width: '90%', marginBottom: '0.5rem' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="product-grid">
          {results.map((product) => (
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
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl mb-8">No products found matching your search.</p>
          <Link href="/" className="btn btn--primary">BACK TO HOME</Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
