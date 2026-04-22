import React from 'react';
import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: { id: string };
  searchParams: { source?: string };
}

async function getProduct(id: string, source: string) {
  let fileName = '';
  const categoryFiles: Record<string, string> = {
    'mens-shoes': 'littledubai-mens-shoes.json',
    'womens-shoes': 'littledubai-womens-shoes.json',
    'mens-slippers': 'littledubai-mens-slippers.json',
    'womens-slippers': 'littledubai-womens-slippers1.json',
    'mens-watches': 'littledubai-mens-watches.json',
    'womens-watches': 'littledubai-womens-watches1.json',
    'mens-bags': 'littledubai-mens-shoes.json',
    'womens-bags': 'littledubai-womens-bags2.json',
    'wallets': 'littledubai-wallets.json',
    'glasses': 'littledubai-glasses.json',
    'belts': 'littledubai-belts.json',
    'mens': 'littledubai-mens-shoes.json',
    'womens': 'littledubai-womens-shoes.json',
    'men': 'littledubai-mens-shoes.json',
    'women': 'littledubai-womens-shoes.json'
  };

  const currentSource = source || 'mens-shoes';
  if (categoryFiles[currentSource]) {
    fileName = categoryFiles[currentSource];
  } else {
    fileName = `littledubai-${currentSource}.json`;
    const brandAliases: Record<string, string> = {
      'new-balance': 'littledubai-nb.json',
      'loro-piana': 'littledubai-lorop.json',
      'zegna': 'littledubai-zeg.json',
      'alexander-mcqueen': 'littledubai-alexander-mqueen.json'
    };
    if (brandAliases[currentSource]) fileName = brandAliases[currentSource];
  }

  // In Next.js App Router, we fetch from local public by using absolute URL in server components 
  // or by reading filesystem. Reading filesystem is safer for server-side.
  const fs = require('fs');
  const path = require('path');
  
  try {
    const filePath = path.join(process.cwd(), 'public', fileName);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      const found = data.products.find((p: any) => String(p.id) === String(id));
      if (found) return found;
    }

    // Fallback search across files
    const fallbacks = [
      'mens-shoes', 'womens-shoes', 'mens-slippers', 'womens-slippers', 
      'adidas', 'nb', 'on-cloud', 'gucci', 'louis-vuitton', 'dior', 
      'prada', 'hermes', 'balenciaga', 'amiri', 'lorop', 'zeg',
      'womens-bags2', 'wallets', 'glasses'
    ];
    for (const fb of fallbacks) {
      const fbPath = path.join(process.cwd(), 'public', `littledubai-${fb}.json`);
      if (fs.existsSync(fbPath)) {
        const fbContent = fs.readFileSync(fbPath, 'utf8');
        const fbData = JSON.parse(fbContent);
        const found = fbData.products.find((p: any) => String(p.id) === String(id));
        if (found) return found;
      }
    }
  } catch (e) {
    console.error("Error finding product server-side", e);
  }
  return null;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const product = await getProduct(params.id, searchParams.source || '');
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
  const product = await getProduct(params.id, searchParams.source || '');

  return (
    <ProductDetailClient 
      initialProduct={product} 
      productId={params.id} 
      source={searchParams.source || 'mens-shoes'} 
    />
  );
}
