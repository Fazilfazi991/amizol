import React from 'react';
import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ source?: string }>;
}

async function getProduct(id: string, source: string) {
  try {
    const { supabase } = require('@/lib/supabase');
    const { data: sbProduct, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (sbProduct) return sbProduct;
  } catch (e) {
    console.warn('Supabase fetch failed for product:', e);
  }

  const categoryFiles: Record<string, string> = {
    'mens-shoes': 'littledubai-mens-shoes.json',
    'womens-shoes': 'littledubai-womens-shoes.json',
    'mens-slippers': 'littledubai-mens-slippers.json',
    'womens-slippers': 'littledubai-womens-slippers1.json',
    'mens-watches': 'littledubai-mens-watches.json',
    'womens-watches': 'littledubai-womens-watches1.json',
    'mens-bags': 'littledubai-mens-shoes.json',
    'womens-bags': 'littledubai-womens-bags2.json',
    wallets: 'littledubai-wallets.json',
    glasses: 'littledubai-glasses.json',
    belts: 'littledubai-belts.json',
    heels: 'littledubai-heels.json',
    mens: 'littledubai-mens-shoes.json',
    womens: 'littledubai-womens-shoes.json',
    men: 'littledubai-mens-shoes.json',
    women: 'littledubai-womens-shoes.json',
  };

  const brandAliases: Record<string, string> = {
    'new-balance': 'littledubai-nb.json',
    'loro-piana': 'littledubai-lorop.json',
    zegna: 'littledubai-zeg.json',
    'alexander-mcqueen': 'littledubai-alexander-mqueen.json',
  };

  const fs = require('fs');
  const path = require('path');

  const currentSource = source || 'mens-shoes';
  let fileName = categoryFiles[currentSource] || brandAliases[currentSource] || `littledubai-${currentSource}.json`;

  try {
    const filePath = path.join(process.cwd(), 'public', fileName);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const found = data.products.find((p: any) => String(p.id) === String(id));
      if (found) return found;
    }

    // Fallback: search across all JSON files in public
    const fallbacks = [
      'mens-shoes', 'womens-shoes', 'mens-slippers', 'womens-slippers',
      'adidas', 'nb', 'on-cloud', 'gucci', 'louis-vuitton', 'dior',
      'prada', 'hermes', 'balenciaga', 'amiri', 'lorop', 'zeg',
      'womens-bags2', 'wallets', 'glasses', 'belts', 'heels',
      'travis-scott', 'golden-goose', 'asics', 'hoka', 'puma',
      'timberland', 'onitsuka-tiger', 'alexander-mqueen',
      'christian-louboutin', 'dolce-gabbana', 'mens-watches', 'womens-watches1',
    ];
    for (const fb of fallbacks) {
      const fbPath = path.join(process.cwd(), 'public', `littledubai-${fb}.json`);
      if (fs.existsSync(fbPath)) {
        const fbData = JSON.parse(fs.readFileSync(fbPath, 'utf8'));
        const found = (fbData.products || []).find((p: any) => String(p.id) === String(id));
        if (found) return found;
      }
    }
  } catch (e) {
    console.error('Error finding product server-side', e);
  }
  return null;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const { source } = await searchParams;
  const product = await getProduct(id, source || '');
  if (!product) return { title: 'Product Not Found | Little Dubai' };

  const name = product.title || product.name;
  const brand = product.vendor || product.brandName || 'Little Dubai';
  const image = product.image_urls?.[0] || product.images?.[0];

  return {
    title: `${brand} ${name} | Little Dubai UAE`,
    description: `Shop the ${brand} ${name} at Little Dubai. Authentic luxury footwear and accessories with express delivery in UAE.`,
    openGraph: {
      title: `${brand} ${name} | Little Dubai`,
      description: `Premium ${brand} ${name} available now at Little Dubai UAE.`,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { source } = await searchParams;
  const product = await getProduct(id, source || '');

  return (
    <ProductDetailClient
      initialProduct={product}
      productId={id}
      source={source || 'mens-shoes'}
    />
  );
}
