'use client';

import React from 'react';
import Link from 'next/link';

const BRANDS = [
  { slug: 'gucci', name: 'Gucci', hero: '/images/gucci_hero.png' },
  { slug: 'prada', name: 'Prada', hero: '/images/prada_hero.png' },
  { slug: 'dior', name: 'Dior', hero: '/images/dior_hero.png' },
  { slug: 'louis-vuitton', name: 'Louis Vuitton', hero: '/images/lv_hero.png' },
  { slug: 'balenciaga', name: 'Balenciaga', hero: '/images/balenciaga_hero.png' },
  { slug: 'hermes', name: 'Hermès', hero: '/images/hermes_hero.png' },
  { slug: 'amiri', name: 'Amiri', hero: '/images/amiri_hero.png' },
  { slug: 'dolce-gabbana', name: 'Dolce & Gabbana', hero: '/images/dg_hero.png' },
  { slug: 'loro-piana', name: 'Loro Piana', hero: '/images/loropiana_hero.png' },
  { slug: 'christian-louboutin', name: 'Christian Louboutin', hero: '/images/louboutin_hero.png' },
  { slug: 'travis-scott', name: 'Travis Scott', hero: '/images/travis_hero.png' },
  { slug: 'zegna', name: 'Zegna', hero: '/images/zegna_hero.png' },
  { slug: 'adidas', name: 'Adidas', hero: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80' },
  { slug: 'new-balance', name: 'New Balance', hero: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80' },
  { slug: 'hoka', name: 'Hoka', hero: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80' },
  { slug: 'on-cloud', name: 'On Cloud', hero: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80' },
  { slug: 'golden-goose', name: 'Golden Goose', hero: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=800&q=80' },
  { slug: 'asics', name: 'Asics', hero: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80' },
  { slug: 'puma', name: 'Puma', hero: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80' },
  { slug: 'timberland', name: 'Timberland', hero: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80' },
  { slug: 'onitsuka-tiger', name: 'Onitsuka Tiger', hero: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80' },
  { slug: 'alexander-mcqueen', name: 'Alexander McQueen', hero: '/images/mcqueen_hero.png' },
];

export default function BrandsPage() {
  return (
    <div>
      <header className="page-header">
        <img src="/images/general_luxury_hero.png" alt="All Brands" className="page-header__image" />
        <div className="page-header__overlay"></div>
        <div className="container page-header__content">
          <h1 className="page-header__title">ALL BRANDS</h1>
          <p className="page-header__subtitle">Explore our curated collection of luxury & lifestyle brands</p>
        </div>
      </header>

      <section className="section container">
        <div className="brand-grid brand-grid--large">
          {BRANDS.map((brand) => (
            <Link key={brand.slug} href={`/brands/${brand.slug}`} className="brand-card">
              <img
                src={brand.hero}
                alt={brand.name}
                onError={(e) => (e.currentTarget.src = '/images/general_luxury_hero.png')}
              />
              <span>{brand.name.toUpperCase()}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
