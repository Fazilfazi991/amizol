import React from 'react';
import { Metadata } from 'next';
import BrandClient from './BrandClient';

interface Props {
  params: { brand: string };
}

const BRAND_DATA_MAP: Record<string, { file: string; sourceLabel: string }> = {
  gucci: { file: 'littledubai-gucci.json', sourceLabel: 'mens' },
  prada: { file: 'littledubai-prada.json', sourceLabel: 'mens' },
  dior: { file: 'littledubai-dior.json', sourceLabel: 'mens' },
  'louis-vuitton': { file: 'littledubai-louis-vuitton.json', sourceLabel: 'mens' },
  balenciaga: { file: 'littledubai-balenciaga.json', sourceLabel: 'mens' },
  hermes: { file: 'littledubai-hermes.json', sourceLabel: 'mens' },
  amiri: { file: 'littledubai-amiri.json', sourceLabel: 'mens' },
  'dolce-gabbana': { file: 'littledubai-dolce-gabbana.json', sourceLabel: 'mens' },
  'loro-piana': { file: 'littledubai-lorop.json', sourceLabel: 'mens' },
  'christian-louboutin': { file: 'littledubai-christian-louboutin.json', sourceLabel: 'womens' },
  'travis-scott': { file: 'littledubai-travis-scott.json', sourceLabel: 'mens' },
  zegna: { file: 'littledubai-zeg.json', sourceLabel: 'mens' },
  adidas: { file: 'littledubai-adidas.json', sourceLabel: 'mens' },
  'new-balance': { file: 'littledubai-nb.json', sourceLabel: 'mens' },
  hoka: { file: 'littledubai-hoka.json', sourceLabel: 'mens' },
  'on-cloud': { file: 'littledubai-on-cloud.json', sourceLabel: 'mens' },
  'golden-goose': { file: 'littledubai-golden-goose.json', sourceLabel: 'mens' },
  asics: { file: 'littledubai-asics.json', sourceLabel: 'mens' },
  puma: { file: 'littledubai-puma.json', sourceLabel: 'mens' },
  timberland: { file: 'littledubai-timberland.json', sourceLabel: 'mens' },
  'onitsuka-tiger': { file: 'littledubai-onitsuka-tiger.json', sourceLabel: 'mens' },
  'alexander-mcqueen': { file: 'littledubai-alexander-mqueen.json', sourceLabel: 'mens' },
  nike: { file: 'littledubai-mens-shoes.json', sourceLabel: 'mens' },
};

async function getBrandData(brandSlug: string) {
  const fs = require('fs');
  const path = require('path');
  const dataConfig = BRAND_DATA_MAP[brandSlug];
  let products: any[] = [];

  if (!dataConfig) {
    const [mensPath, womensPath] = [
      path.join(process.cwd(), 'public', 'littledubai-mens-shoes.json'),
      path.join(process.cwd(), 'public', 'littledubai-womens-shoes.json')
    ];
    
    if (fs.existsSync(mensPath) && fs.existsSync(womensPath)) {
      const mensData = JSON.parse(fs.readFileSync(mensPath, 'utf8'));
      const womensData = JSON.parse(fs.readFileSync(womensPath, 'utf8'));
      const all = [
        ...mensData.products.map((p: any) => ({ ...p, source: 'mens' })),
        ...womensData.products.map((p: any) => ({ ...p, source: 'womens' })),
      ];
      const searchTerm = brandSlug.replace(/-/g, ' ').toLowerCase();
      products = all.filter((p: any) =>
        (p.vendor || p.brandName || '').toLowerCase().includes(searchTerm)
      );
    }
  } else {
    const filePath = path.join(process.cwd(), 'public', dataConfig.file);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      products = (data.products || []).map((p: any) => ({
        ...p,
        source: dataConfig.sourceLabel,
      }));
    }
  }
  return products;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brandName = params.brand.replace(/-/g, ' ').toUpperCase();
  return {
    title: `${brandName} Collection | Little Dubai UAE`,
    description: `Shop the latest authentic ${brandName} footwear and accessories at Little Dubai. Express delivery across UAE.`,
  };
}

export default async function BrandPage({ params }: Props) {
  const products = await getBrandData(params.brand);
  
  return (
    <BrandClient 
      brandSlug={params.brand}
      initialProducts={products}
    />
  );
}
