'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';

// All available product JSON sources
const ALL_SOURCES = [
  { file: 'littledubai-mens-shoes.json',      source: 'mens-shoes' },
  { file: 'littledubai-womens-shoes.json',    source: 'womens-shoes' },
  { file: 'littledubai-mens-slippers.json',   source: 'mens-slippers' },
  { file: 'littledubai-womens-slippers1.json',source: 'womens-slippers' },
  { file: 'littledubai-adidas.json',          source: 'adidas' },
  { file: 'littledubai-nb.json',              source: 'new-balance' },
  { file: 'littledubai-on-cloud.json',        source: 'on-cloud' },
  { file: 'littledubai-gucci.json',           source: 'gucci' },
  { file: 'littledubai-louis-vuitton.json',   source: 'louis-vuitton' },
  { file: 'littledubai-dior.json',            source: 'dior' },
  { file: 'littledubai-prada.json',           source: 'prada' },
  { file: 'littledubai-hermes.json',          source: 'hermes' },
  { file: 'littledubai-balenciaga.json',      source: 'balenciaga' },
  { file: 'littledubai-amiri.json',           source: 'amiri' },
  { file: 'littledubai-lorop.json',           source: 'loro-piana' },
  { file: 'littledubai-zeg.json',             source: 'zegna' },
  { file: 'littledubai-christian-louboutin.json', source: 'christian-louboutin' },
  { file: 'littledubai-alexander-mqueen.json',source: 'alexander-mcqueen' },
  { file: 'littledubai-golden-goose.json',    source: 'golden-goose' },
  { file: 'littledubai-travis-scott.json',    source: 'travis-scott' },
  { file: 'littledubai-dolce-gabbana.json',   source: 'dolce-gabbana' },
  { file: 'littledubai-asics.json',           source: 'asics' },
  { file: 'littledubai-hoka.json',            source: 'hoka' },
  { file: 'littledubai-puma.json',            source: 'puma' },
  { file: 'littledubai-timberland.json',      source: 'timberland' },
  { file: 'littledubai-onitsuka-tiger.json',  source: 'onitsuka-tiger' },
  { file: 'littledubai-heels.json',           source: 'heels' },
  { file: 'littledubai-wallets.json',         source: 'wallets' },
  { file: 'littledubai-glasses.json',         source: 'glasses' },
  { file: 'littledubai-belts.json',           source: 'belts' },
  { file: 'littledubai-mens-watches.json',    source: 'mens-watches' },
  { file: 'littledubai-womens-watches1.json', source: 'womens-watches' },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setResults([]);
      return;
    }

    async function performSearch() {
      setLoading(true);
      try {
        const q = query.toLowerCase();

        // Fetch all sources in parallel
        const responses = await Promise.allSettled(
          ALL_SOURCES.map(({ file }) => fetch(`/${file}`).then(r => r.ok ? r.json() : null))
        );

        const allResults: any[] = [];
        responses.forEach((res, i) => {
          if (res.status === 'fulfilled' && res.value) {
            const { source } = ALL_SOURCES[i];
            const items = (res.value.products || []).filter((p: any) => {
              const searchStr = `${p.title} ${p.vendor} ${p.product_type} ${p.brandName} ${p.tags}`.toLowerCase();
              return searchStr.includes(q);
            }).map((p: any) => ({ ...p, source }));
            allResults.push(...items);
          }
        });

        // Deduplicate by ID
        const unique = Array.from(new Map(allResults.map(item => [item.id, item])).values());
        setResults(unique);
      } catch (e) {
        console.error('Search failed', e);
        setResults([]);
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
          {loading
            ? 'Searching across all products...'
            : `${results.length} result${results.length !== 1 ? 's' : ''} found for "${query}"`}
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
                source: product.source,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl mb-4">No products found for &ldquo;{query}&rdquo;</p>
          <p className="text-secondary mb-8">Try a different search term, or browse our categories.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/category/men" className="btn btn--primary">Shop Men</Link>
            <Link href="/category/women" className="btn btn--secondary">Shop Women</Link>
            <Link href="/brands" className="btn btn--ghost">All Brands</Link>
          </div>
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
