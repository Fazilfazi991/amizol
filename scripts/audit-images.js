const fs = require('fs');
const path = require('path');
const https = require('https');

const publicDir = path.join(process.cwd(), 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.json') && f.startsWith('littledubai-'));

const cloudImageRegex = /31122025150715qXuhgIDHTMDE/;

let totalProducts = 0;
let duplicateCloudCount = 0;
let allUrls = new Set();
let productsWithCloud = [];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(publicDir, file), 'utf8'));
  const products = data.products || [];
  totalProducts += products.length;

  for (const p of products) {
    const urls = p.image_urls || [];
    let hasCloud = false;
    for (const url of urls) {
      allUrls.add(url);
      if (cloudImageRegex.test(url)) {
        duplicateCloudCount++;
        hasCloud = true;
      }
    }
    if (hasCloud) {
      productsWithCloud.push({ id: p.id, title: p.title, file });
    }
  }
}

console.log(`Audit Summary:`);
console.log(`Total Products checked: ${totalProducts}`);
console.log(`Total unique image URLs: ${allUrls.size}`);
console.log(`Total duplicate cloud images found: ${duplicateCloudCount}`);
console.log(`Products with cloud images: ${productsWithCloud.length}`);

// We won't test all URLs over network as it would take too long, but this gives us a good idea.
