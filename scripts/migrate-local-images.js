const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const mime = require('mime-types');

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mherqrjuoafvkbauvaob.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZXJxcmp1b2FmdmtiYXV2YW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NDkyMTAsImV4cCI6MjA5MjMyNTIxMH0.wypisj0nT9iw-PE6NU8FJU6GzeW2AXw7zrxM9BhrpKs';
const supabase = createClient(supabaseUrl, supabaseKey);

const PHOTOS_DIR = path.resolve('C:\\Users\\Perfect Elect\\Downloads\\Amizol\\Photos');
const TEMP_EXTRACT_DIR = path.join(PHOTOS_DIR, 'extracted_temp');
const BUCKET_NAME = 'product-images';

async function ensureBucketExists() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError.message);
    return;
  }

  const bucketExists = buckets.some(b => b.name === BUCKET_NAME);
  if (!bucketExists) {
    console.log(`Bucket "${BUCKET_NAME}" does not exist. Creating...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880 // 5MB
    });
    if (createError) {
      console.error(`Failed to create bucket "${BUCKET_NAME}":`, createError.message);
      console.log('You may need to create this bucket manually in the Supabase Dashboard and set it to Public.');
      process.exit(1);
    } else {
      console.log(`Bucket "${BUCKET_NAME}" created successfully.`);
    }
  } else {
    console.log(`Bucket "${BUCKET_NAME}" already exists.`);
  }
}

async function uploadImage(localPath, remotePath) {
  const fileBuffer = fs.readFileSync(localPath);
  const contentType = mime.lookup(localPath) || 'application/octet-stream';

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(remotePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(remotePath);

  return publicUrlData.publicUrl;
}

function extractZips() {
  if (!fs.existsSync(TEMP_EXTRACT_DIR)) {
    fs.mkdirSync(TEMP_EXTRACT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(PHOTOS_DIR);
  const zipFiles = files.filter(f => f.endsWith('.zip'));

  for (const zipFile of zipFiles) {
    const zipPath = path.join(PHOTOS_DIR, zipFile);
    console.log(`Extracting ${zipFile}...`);
    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(TEMP_EXTRACT_DIR, true);
    } catch (err) {
      console.error(`Error extracting ${zipFile}:`, err.message);
    }
  }
}

async function processExtractedImages() {
  console.log('Scanning extracted folders...');
  
  // Recursively find all product folders (folders containing images)
  const productFolders = [];
  
  function scanDir(dir) {
    const items = fs.readdirSync(dir);
    let hasImages = false;
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else {
        const ext = path.extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
          hasImages = true;
        }
      }
    }
    
    // If this directory contains images, treat its name as the product name
    if (hasImages) {
      productFolders.push({
        name: path.basename(dir),
        path: dir
      });
    }
  }
  
  scanDir(TEMP_EXTRACT_DIR);
  
  console.log(`Found ${productFolders.length} product folders with images.`);
  
  // Fetch all products from DB to match
  const { data: dbProducts, error: dbError } = await supabase
    .from('products')
    .select('id, name, images');
    
  if (dbError) {
    console.error('Error fetching products from DB:', dbError.message);
    return;
  }
  
  console.log(`Fetched ${dbProducts.length} products from database.`);
  
  let matchCount = 0;
  
  for (const folder of productFolders) {
    // Try to find a matching product by name (case-insensitive)
    const matchingProduct = dbProducts.find(p => p.name.toLowerCase() === folder.name.toLowerCase());
    
    if (matchingProduct) {
      matchCount++;
      console.log(`\nMatched product: "${matchingProduct.name}"`);
      
      const imagesInFolder = fs.readdirSync(folder.path).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
      });
      
      const newImageUrls = [];
      
      for (const imageFile of imagesInFolder) {
        const localPath = path.join(folder.path, imageFile);
        // Clean filename for remote path
        const safeFileName = imageFile.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
        const remotePath = `products/${matchingProduct.id}/${safeFileName}`;
        
        try {
          const publicUrl = await uploadImage(localPath, remotePath);
          newImageUrls.push(publicUrl);
        } catch (err) {
          console.error(`Failed to upload ${imageFile}:`, err.message);
        }
      }
      
      if (newImageUrls.length > 0) {
        // Update product in DB
        const { error: updateError } = await supabase
          .from('products')
          .update({ images: newImageUrls })
          .eq('id', matchingProduct.id);
          
        if (updateError) {
          console.error(`Failed to update DB for product "${matchingProduct.name}":`, updateError.message);
        } else {
          console.log(`Updated DB for "${matchingProduct.name}" with ${newImageUrls.length} images.`);
        }
      }
    } else {
      console.log(`[Unmatched] No DB product found for folder: "${folder.name}"`);
    }
  }
  
  console.log(`\nMigration Summary: Matched ${matchCount} out of ${productFolders.length} folders to database products.`);
}

async function run() {
  try {
    // await ensureBucketExists(); // Skip check, bucket exists but RLS hides it from listBuckets
    console.log('--- Step 1: Extracting Zips ---');
    extractZips();
    console.log('--- Step 2: Uploading Images & Updating DB ---');
    await processExtractedImages();
    console.log('--- Step 3: Cleanup ---');
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

run();
