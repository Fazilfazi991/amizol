import React from 'react';
import { Metadata } from 'next';
import CategoryClient from './CategoryClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

type CategoryConfig = {
  title: string;
  hero: string;
  mobileHero?: string;
  sources: { file: string; sourceLabel: string }[];
  filter?: (p: any) => boolean;
};

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  men: {
    title: "MEN'S COLLECTION",
    hero: '/images/mens-shoes-l.jpg',
    mobileHero: '/images/mens-shoe-hero-m.png',
    sources: [{ file: 'littledubai-mens-shoes.json', sourceLabel: 'mens' }],
  },
  women: {
    title: "WOMEN'S COLLECTION",
    hero: '/images/w1.jpg',
    mobileHero: '/images/w2.jpg',
    sources: [{ file: 'littledubai-womens-shoes.json', sourceLabel: 'womens' }],
  },
  'mens-shoes': {
    title: "MEN'S SHOES",
    hero: '/images/mens-shoes-l.jpg',
    mobileHero: '/images/mens-shoe-hero-m.png',
    sources: [{ file: 'littledubai-mens-shoes.json', sourceLabel: 'mens' }],
  },
  'womens-shoes': {
    title: "WOMEN'S SHOES",
    hero: '/images/womens-shoes-l.jpg',
    mobileHero: '/images/w2.jpg',
    sources: [{ file: 'littledubai-womens-shoes.json', sourceLabel: 'womens' }],
  },
  'mens-bags': {
    title: "MEN'S BAGS",
    hero: '/images/mens-shoe-hero-l.jpg',
    mobileHero: '/images/mens-shoe-hero-m.png',
    sources: [{ file: 'littledubai-mens-shoes.json', sourceLabel: 'mens' }],
    filter: (p) => p.title?.toLowerCase().includes('bag') || p.product_type?.toLowerCase().includes('bag'),
  },
  'womens-bags': {
    title: "WOMEN'S BAGS",
    hero: '/images/womens-bags-l.jpg',
    mobileHero: '/images/womens-bags-hero-m.png',
    sources: [{ file: 'littledubai-womens-bags2.json', sourceLabel: 'womens' }],
  },
  'mens-slippers': {
    title: "MEN'S SLIPPERS",
    hero: "/images/mens-slippers-l.jpg",
    mobileHero: '/images/mens-slippers-hero-m.png',
    sources: [{ file: 'littledubai-mens-slippers.json', sourceLabel: 'mens' }],
  },
  'womens-slippers': {
    title: "WOMEN'S SLIPPERS",
    hero: '/images/womens-slippers-l.jpg',
    mobileHero: '/images/womens-slippers-m.png',
    sources: [{ file: 'littledubai-womens-slippers1.json', sourceLabel: 'womens' }],
  },
  'mens-watches': {
    title: "MEN'S WATCHES",
    hero: '/images/mens-shoe-hero-l.jpg',
    mobileHero: '/images/mens-shoe-hero-m.png',
    sources: [{ file: 'littledubai-mens-watches.json', sourceLabel: 'mens' }],
  },
  'womens-watches': {
    title: "WOMEN'S WATCHES",
    hero: '/images/w1.jpg',
    mobileHero: '/images/w2.jpg',
    sources: [{ file: 'littledubai-womens-watches1.json', sourceLabel: 'womens' }],
  },
  wallets: {
    title: 'WALLETS',
    hero: '/images/wallets-l.jpg',
    mobileHero: '/images/wallets-hero-m.png',
    sources: [{ file: 'littledubai-wallets.json', sourceLabel: 'mens' }],
  },
  glasses: {
    title: 'GLASSES',
    hero: '/images/glasses-l.jpg',
    mobileHero: '/images/glasses-hero-m.png',
    sources: [{ file: 'littledubai-glasses.json', sourceLabel: 'mens' }],
  },
  belts: {
    title: 'BELTS',
    hero: '/images/belts-l.jpg',
    mobileHero: '/images/belts-hero-m.png',
    sources: [{ file: 'littledubai-belts.json', sourceLabel: 'mens' }],
  },
  accessories: {
    title: 'ACCESSORIES',
    hero: '/images/wallets-hero-l.jpg',
    mobileHero: '/images/wallets-hero-m.png',
    sources: [
      { file: 'littledubai-wallets.json', sourceLabel: 'mens' },
      { file: 'littledubai-glasses.json', sourceLabel: 'mens' },
      { file: 'littledubai-belts.json', sourceLabel: 'mens' },
    ],
  },
  heels: {
    title: 'HEELS',
    hero: '/images/w1.jpg',
    mobileHero: '/images/w2.jpg',
    sources: [{ file: 'littledubai-heels.json', sourceLabel: 'womens' }],
  },
  shoes: {
    title: 'SHOES',
    hero: '/images/mens-shoe-hero-l.jpg',
    mobileHero: '/images/mens-shoe-hero-m.png',
    sources: [
      { file: 'littledubai-mens-shoes.json', sourceLabel: 'mens' },
      { file: 'littledubai-womens-shoes.json', sourceLabel: 'womens' },
    ],
  },
  slippers: {
    title: 'SLIPPERS',
    hero: '/images/mens-slippers-hero-l.jpg',
    mobileHero: '/images/mens-slippers-hero-m.png',
    sources: [
      { file: 'littledubai-mens-slippers.json', sourceLabel: 'mens' },
      { file: 'littledubai-womens-slippers1.json', sourceLabel: 'womens' },
    ],
  },
  'new-arrivals': {
    title: 'NEW ARRIVALS',
    hero: '/images/mens-shoe-hero-l.jpg',
    mobileHero: '/images/mens-shoe-hero-m.png',
    sources: [
      { file: 'littledubai-mens-shoes.json', sourceLabel: 'mens' },
      { file: 'littledubai-womens-shoes.json', sourceLabel: 'womens' },
    ],
  },
};

async function getCategoryData(slug: string) {
  const config = CATEGORY_MAP[slug];
  if (!config) return null;

  try {
    const { supabase } = require('@/lib/supabase');
    const { data: sbProducts, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', slug);

    if (sbProducts && sbProducts.length > 0) {
      console.log(`SUPABASE: Loaded ${sbProducts.length} products for category ${slug}`);
      return { config, products: sbProducts.map((p: any) => ({ ...p, source: slug })) };
    } else {
      console.log(`SUPABASE: No products found for category ${slug}`);
    }
  } catch (e: any) {
    console.error(`SUPABASE ERROR for category ${slug}:`, e.message);
  }

  // Fallback to JSON
  const fs = require('fs');
  const path = require('path');
  const allProducts: any[] = [];

  for (const source of config.sources) {
    const filePath = path.join(process.cwd(), 'public', source.file);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const items = (data.products || []).map((p: any) => ({
        ...p,
        source: source.sourceLabel,
      }));
      allProducts.push(...items);
    }
  }

  const filtered = config.filter ? allProducts.filter(config.filter) : allProducts;
  return { config, products: filtered };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryData(slug);
  if (!data) return { title: 'Category Not Found | Little Dubai' };

  return {
    title: `${data.config.title} | Little Dubai UAE`,
    description: `Shop the latest ${data.config.title.toLowerCase()} from luxury brands at Little Dubai. Authentic items with express delivery.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCategoryData(slug);

  return (
    <CategoryClient
      slug={slug}
      initialConfig={data?.config}
      initialProducts={data?.products || []}
    />
  );
}
