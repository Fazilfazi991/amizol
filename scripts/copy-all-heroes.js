const fs = require('fs');
const path = require('path');

const dest = 'C:\\Users\\Perfect Elect\\Downloads\\Amizol\\little-dubai-next\\public\\images';

// === LAPTOP FILES ===
const laptopSrc = 'C:\\Users\\Perfect Elect\\Downloads\\Amizol\\LAPTOP VIEW new\\LAPTOP VIEW';
const laptopMap = [
  { src: 'ALEXANDER MCQUEEN L.jpg', dest: 'alexander-mcqueen-l.jpg' },
  { src: 'AMIRI L.jpg',             dest: 'amiri-l.jpg' },
  { src: 'Asics L.jpg',             dest: 'asics-l.jpg' },
  { src: 'BELTS L.jpg',             dest: 'belts-l.jpg' },
  { src: 'CHRISTIAN LOUBOUTIN L.jpg', dest: 'christian-louboutin-l.jpg' },
  { src: 'DIOR L.jpg',              dest: 'dior-l.jpg' },
  { src: 'DOLCE GABBANA L.jpg',     dest: 'dolce-gabbana-l.jpg' },
  { src: 'GLASSES L.jpg',           dest: 'glasses-l.jpg' },
  { src: 'GOLDEN GOOSE L.jpg',      dest: 'golden-goose-l.jpg' },
  { src: 'GUCCI L.jpg',             dest: 'gucci-l.jpg' },
  { src: 'HERMES L.jpg',            dest: 'hermes-l.jpg' },
  { src: 'HOKA L.jpg',              dest: 'hoka-l.jpg' },
  { src: 'Loro Piana L.jpg',        dest: 'loro-piana-l.jpg' },
  { src: 'LOUIS VUITTON L.jpg',     dest: 'louis-vuitton-l.jpg' },
  { src: "men shoes L .jpg",        dest: 'mens-shoes-l.jpg' },
  { src: "MEN'S SLIPPERS L.jpg",    dest: 'mens-slippers-l.jpg' },
  { src: 'NEW BALANCE L.jpg',       dest: 'new-balance-l.jpg' },
  { src: 'NIKE L.jpg',              dest: 'nike-l.jpg' },
  { src: 'ON CLOUD L.jpg',          dest: 'on-cloud-l.jpg' },
  { src: 'ONITSUKA TIGER L.jpg',    dest: 'onitsuka-tiger-l.jpg' },
  { src: 'Prada L.jpg',             dest: 'prada-l.jpg' },
  { src: 'PUMA L.jpg',              dest: 'puma-l.jpg' },
  { src: 'TIMBERLAND L.jpg',        dest: 'timberland-l.jpg' },
  { src: 'TRAVIS SCOTT  L.jpg',     dest: 'travis-scott-l.jpg' },
  { src: 'WALLETS L.jpg',           dest: 'wallets-l.jpg' },
  { src: 'WOMEN BAGES L.jpg',       dest: 'womens-bags-l.jpg' },
  { src: 'women shoes L.jpg',       dest: 'womens-shoes-l.jpg' },
  { src: 'WOMEN SLIPPERS L.png.jpg',dest: 'womens-slippers-l.jpg' },
  { src: 'ZEGNA L.jpg',             dest: 'zegna-l.jpg' },
];

// === MOBILE FILES ===
const mobileSrc = 'C:\\Users\\Perfect Elect\\Downloads\\Amizol\\MOBILE VIEW new\\MOBILE VIEW';
const mobileMap = [
  { src: 'BELTS.png',              dest: 'belts-m.png' },
  { src: 'CHRISTIAN LOUBOUTIN.png',dest: 'christian-louboutin-m.png' },
  { src: 'GLASSES.png',            dest: 'glasses-m.png' },
  { src: 'GUCCI .png',             dest: 'gucci-m.png' },
  { src: 'HERMES.png',             dest: 'hermes-m.png' },
  { src: 'HOKA.png',               dest: 'hoka-m.png' },
  { src: 'Loro Piana.png',         dest: 'loro-piana-m.png' },
  { src: 'MEN SHOES.png',          dest: 'mens-shoes-m.png' },
  { src: "MEN'S SLIPPERS.png",     dest: 'mens-slippers-m.png' },
  { src: 'NIKE.png',               dest: 'nike-m.png' },
  { src: 'ON CLOUD.png',           dest: 'on-cloud-m.png' },
  { src: 'Prada.png',              dest: 'prada-m.png' },
  { src: 'TRAVIS SCOTT.png',       dest: 'travis-scott-m.png' },
  { src: 'WALLETS.png',            dest: 'wallets-m.png' },
  { src: 'WOMEN BAGES.png',        dest: 'womens-bags-m.png' },
  { src: 'women shoes .jpg',       dest: 'womens-shoes-m.jpg' },
  { src: 'WOMEN SLIPPERS.png',     dest: 'womens-slippers-m.png' },
];

let copied = 0, skipped = 0;

function copyFiles(srcDir, map, label) {
  console.log(`\n=== ${label} ===`);
  for (const { src, dest: destName } of map) {
    const srcPath = path.join(srcDir, src);
    const destPath = path.join(dest, destName);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ ${src} → ${destName}`);
      copied++;
    } else {
      console.warn(`✗ MISSING: ${src}`);
      skipped++;
    }
  }
}

copyFiles(laptopSrc, laptopMap, 'LAPTOP');
copyFiles(mobileSrc, mobileMap, 'MOBILE');

console.log(`\nDone: ${copied} copied, ${skipped} skipped.`);
