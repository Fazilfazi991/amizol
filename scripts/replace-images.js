const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const productsImageDir = path.join(publicDir, 'images', 'products');

// Ensure the directory exists
if (!fs.existsSync(productsImageDir)) {
  fs.mkdirSync(productsImageDir, { recursive: true });
}

const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.json') && f.startsWith('littledubai-'));

const cloudImageRegex = /31122025150715qXuhgIDHTMDE/;

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(publicDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let modified = false;

  const products = data.products || [];

  for (const p of products) {
    let newUrls = [];
    let hasChanges = false;
    
    // Check if the user placed an image for this product
    // We check common extensions for the product handle or ID
    const possibleNames = [
      `${p.handle}.jpg`, `${p.handle}.png`, `${p.handle}.webp`,
      `${p.id}.jpg`, `${p.id}.png`, `${p.id}.webp`
    ];

    let foundLocalImage = null;
    for (const name of possibleNames) {
      if (fs.existsSync(path.join(productsImageDir, name))) {
        foundLocalImage = `/images/products/${name}`;
        break;
      }
    }

    if (foundLocalImage) {
      // Replace with local image
      p.image_urls = [foundLocalImage];
      p.images = [{ src: foundLocalImage }];
      hasChanges = true;
    } else {
      // Filter out duplicate cloud placeholders if no local image is found
      const urls = p.image_urls || [];
      for (const url of urls) {
        if (!cloudImageRegex.test(url)) {
          newUrls.push(url);
        } else {
          hasChanges = true; // We removed a cloud image
        }
      }
      
      if (hasChanges && newUrls.length > 0) {
        p.image_urls = newUrls;
        // Keep the objects structure for 'images' property
        if (p.images) {
           p.images = p.images.filter(img => !cloudImageRegex.test(img.src));
        }
      } else if (hasChanges && newUrls.length === 0) {
        // If it only had cloud images, leave it empty so the fallback kicks in
        p.image_urls = [];
        p.images = [];
      }
    }

    if (hasChanges) {
      modified = true;
      updatedCount++;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${file}`);
  }
}

console.log(`\nMigration complete. Updated ${updatedCount} products.`);
console.log(`Note: If you have original images, place them in 'public/images/products/' named by the product handle (e.g., 'hermes-bouncing-sneaker.jpg') and re-run this script.`);
