const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Replace these with actual values from .env.local if running locally
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mherqrjuoafvkbauvaob.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZXJxcmp1b2FmdmtiYXV2YW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NDkyMTAsImV4cCI6MjA5MjMyNTIxMH0.wypisj0nT9iw-PE6NU8FJU6GzeW2AXw7zrxM9BhrpKs';
const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  'mens-shoes', 'womens-shoes', 'mens-slippers', 'womens-slippers',
  'mens-watches', 'womens-watches1', 'wallets', 'glasses', 'belts', 'heels'
];

async function migrate() {
  console.log('Starting migration...');

  for (const cat of categories) {
    const filePath = path.join(process.cwd(), 'public', `littledubai-${cat}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${cat}, file not found.`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const products = data.products;

    console.log(`Migrating ${products.length} products from ${cat}...`);

    for (const p of products) {
      const { error } = await supabase
        .from('products')
        .upsert({
          id: String(p.id),
          name: p.title || p.name,
          brand: p.vendor || p.brandName,
          price: String(p.price),
          images: p.image_urls || p.images || [],
          category: cat,
          description: p.description || '',
          product_type: p.product_type || '',
          vendor: p.vendor || ''
        }, { onConflict: 'id' });

      if (error) {
        console.error(`Error migrating product ${p.id}:`, error.message);
      }
    }
  }

  console.log('Migration complete!');
}

migrate();
