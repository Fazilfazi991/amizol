import React from 'react';
import { Metadata } from 'next';
import CategoryClient from './CategoryClient';

interface Props {
  params: { slug: string };
}

// Map each category slug to its data source(s) and a filter function
type CategoryConfig = {
  title: string;
  hero: string;
  sources: { file: string; sourceLabel: string }[];
  filter?: (p: any) => boolean;
};

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  men: {
    title: "MEN'S COLLECTION",
    hero: '/images/mens_hero.png',
    sources: [{ file: 'littledubai-mens-shoes.json', sourceLabel: 'mens' }],
  },
  women: {
    title: "WOMEN'S COLLECTION",
    hero: '/images/womens_hero.png',
    sources: [{ file: 'littledubai-womens-shoes.json', sourceLabel: 'womens' }],
  },
  'mens-shoes': {
    title: "MEN'S SHOES",
    hero: '/images/mens_hero.png',
    sources: [{ file: 'littledubai-mens-shoes.json', sourceLabel: 'mens' }],
  },
  'womens-shoes': {
    title: "WOMEN'S SHOES",
    hero: '/images/womens_hero.png',
    sources: [{ file: 'littledubai-womens-shoes.json', sourceLabel: 'womens' }],
  },
  'mens-bags': {
    title: "MEN'S BAGS",
    hero: '/images/mens_hero.png',
    sources: [{ file: 'littledubai-mens-shoes.json', sourceLabel: 'mens' }],
    filter: (p) => p.title?.toLowerCase().includes('bag') || p.product_type?.toLowerCase().includes('bag'),
  },
  'womens-bags': {
    title: "WOMEN'S BAGS",
    hero: '/images/womens_hero.png',
    sources: [{ file: 'littledubai-womens-bags2.json', sourceLabel: 'womens' }],
  },
  'mens-slippers': {
    title: "MEN'S SLIPPERS",
    hero: '/images/mens_hero.png',
    sources: [{ file: 'littledubai-mens-slippers.json', sourceLabel: 'mens' }],
  },
  'womens-slippers': {
    title: "WOMEN'S SLIPPERS",
    hero: '/images/womens_hero.png',
    sources: [{ file: 'littledubai-womens-slippers1.json', sourceLabel: 'womens' }],
  },
  'mens-watches': {
    title: "MEN'S WATCHES",
    hero: '/images/mens_hero.png',
    sources: [{ file: 'littledubai-mens-watches.json', sourceLabel: 'mens' }],
  },
  'womens-watches': {
    title: "WOMEN'S WATCHES",
    hero: '/images/womens_hero.png',
    sources: [{ file: 'littledubai-womens-watches1.json', sourceLabel: 'womens' }],
  },
  'new-arrivals': {
    title: 'NEW ARRIVALS',
    hero: '/images/general_luxury_hero.png',
    sources: [
      { file: 'littledubai-mens-shoes.json', sourceLabel: 'mens' },
      { file: 'littledubai-womens-shoes.json', sourceLabel: 'womens' },
    ],
  },
};

async function getCategoryData(slug: string) {
  const config = CATEGORY_MAP[slug];
  if (!config) return null;

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
  const data = await getCategoryData(params.slug);
  if (!data) return { title: 'Category Not Found | Little Dubai' };

  return {
    title: `${data.config.title} | Little Dubai UAE`,
    description: `Shop the latest ${data.config.title.toLowerCase()} from luxury brands at Little Dubai. Authentic items with express delivery.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const data = await getCategoryData(params.slug);
  
  return (
    <CategoryClient 
      slug={params.slug}
      initialConfig={data?.config}
      initialProducts={data?.products || []}
    />
  );
}
