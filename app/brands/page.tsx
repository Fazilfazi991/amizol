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
  { slug: 'adidas', name: 'Adidas', hero: '/images/general_luxury_hero.png' },
  { slug: 'new-balance', name: 'New Balance', hero: '/images/general_luxury_hero.png' },
  { slug: 'hoka', name: 'Hoka', hero: '/images/general_luxury_hero.png' },
  { slug: 'on-cloud', name: 'On Cloud', hero: '/images/general_luxury_hero.png' },
  { slug: 'golden-goose', name: 'Golden Goose', hero: '/images/general_luxury_hero.png' },
  { slug: 'asics', name: 'Asics', hero: '/images/general_luxury_hero.png' },
  { slug: 'puma', name: 'Puma', hero: '/images/general_luxury_hero.png' },
  { slug: 'timberland', name: 'Timberland', hero: '/images/general_luxury_hero.png' },
  { slug: 'onitsuka-tiger', name: 'Onitsuka Tiger', hero: '/images/general_luxury_hero.png' },
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
