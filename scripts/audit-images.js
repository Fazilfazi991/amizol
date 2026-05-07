const fs = require('fs');
const path = require('path');

const projectRoot = 'C:\\Users\\Perfect Elect\\Downloads\\Amizol\\little-dubai-next';
const imagesDir = path.join(projectRoot, 'public', 'images');

// Check category mappings
const categoryFile = path.join(projectRoot, 'app', 'category', '[slug]', 'page.tsx');
const categoryContent = fs.readFileSync(categoryFile, 'utf8');

const heroRegex = /hero:\s*['"](.+?)['"]/g;
let match;
console.log('Checking Category Heroes:');
while ((match = heroRegex.exec(categoryContent)) !== null) {
    const heroPath = match[1];
    const fullPath = path.join(projectRoot, 'public', heroPath);
    if (!fs.existsSync(fullPath)) {
        console.error(`MISSING: ${heroPath}`);
    } else {
        console.log(`FOUND: ${heroPath}`);
    }
}

// Check brand mappings
const brandFile = path.join(projectRoot, 'app', 'brands', '[brand]', 'BrandClient.tsx');
const brandContent = fs.readFileSync(brandFile, 'utf8');

console.log('\nChecking Brand Heroes:');
while ((match = heroRegex.exec(brandContent)) !== null) {
    const heroPath = match[1];
    const fullPath = path.join(projectRoot, 'public', heroPath);
    if (!fs.existsSync(fullPath)) {
        console.error(`MISSING: ${heroPath}`);
    } else {
        console.log(`FOUND: ${heroPath}`);
    }
}
