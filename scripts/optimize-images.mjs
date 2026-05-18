import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('assets/images');
const OUT = path.resolve('assets/images/opt');

const tasks = [
  // Hero
  { src: 'hero/hero-main.jpg', name: 'hero/hero-main', width: 800, q: 80 },
  { src: 'hero/hero-small-top.jpg', name: 'hero/hero-small-top', width: 533, q: 80 },
  { src: 'hero/hero-creative-space.jpg', name: 'hero/hero-creative-space', width: 533, q: 80 },

  // Program cards
  { src: 'gallery/crafts-workshop.jpg', name: 'gallery/crafts-workshop', width: 600, q: 80 },
  { src: 'gallery/sports-adventure.jpg', name: 'gallery/sports-adventure', width: 600, q: 80 },
  { src: 'gallery/games-quest.jpg', name: 'gallery/games-quest', width: 600, q: 80 },

  // Gallery rail
  { src: 'gallery/gallery-01.jpg', name: 'gallery/gallery-01', width: 600, q: 80 },
  { src: 'gallery/gallery-02.jpg', name: 'gallery/gallery-02', width: 600, q: 80 },
  { src: 'gallery/gallery-03.jpg', name: 'gallery/gallery-03', width: 600, q: 80 },

  // Avatars (just webp, keep existing size)
  { src: 'avatars/review-01.jpg', name: 'avatars/review-01', width: 200, q: 85, jpeg: false },
  { src: 'avatars/review-02.jpg', name: 'avatars/review-02', width: 200, q: 85, jpeg: false },
  { src: 'avatars/review-03.jpg', name: 'avatars/review-03', width: 200, q: 85, jpeg: false },

  // Social icons
  { src: 'icons/telegram.png', name: 'icons/telegram', width: 64, q: 85, jpeg: false },
  { src: 'icons/whatsapp.png', name: 'icons/whatsapp', width: 64, q: 85, jpeg: false },
  { src: 'icons/max.png', name: 'icons/max', width: 64, q: 85, jpeg: false },

  // OG image
  { src: 'social/og-image.png', name: 'social/og-image', width: 1200, height: 630, q: 80, fit: 'cover' },
];

async function processTask(task) {
  const inputPath = path.join(ROOT, task.src);
  const outDir = path.join(OUT, path.dirname(task.name));
  fs.mkdirSync(outDir, { recursive: true });

  const baseName = path.basename(task.name);
  const pipeline = sharp(inputPath).resize({
    width: task.width,
    height: task.height || undefined,
    fit: task.fit || 'inside',
    withoutEnlargement: true,
  });

  const jpeg = task.jpeg !== false;
  const results = [];

  // WebP always
  const webpPath = path.join(outDir, `${baseName}.webp`);
  await pipeline.clone().webp({ quality: task.q }).toFile(webpPath);
  results.push(webpPath);

  // JPEG fallback (skip for avatars/icons)
  if (jpeg) {
    const jpgPath = path.join(outDir, `${baseName}.jpg`);
    await pipeline.clone().jpeg({ quality: task.q, mozjpeg: true }).toFile(jpgPath);
    results.push(jpgPath);
  }

  return results;
}

async function main() {
  console.log(`Optimizing ${tasks.length} images...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const task of tasks) {
    const inputPath = path.join(ROOT, task.src);
    const before = fs.statSync(inputPath).size;

    const files = await processTask(task);
    const after = files.reduce((acc, f) => acc + fs.statSync(f).size, 0);

    const saved = ((before - after) / before * 100).toFixed(1);
    console.log(`  ${task.src.padEnd(40)} ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (${saved}%)`);

    totalBefore += before;
    totalAfter += after;
  }

  const totalSaved = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1);
  console.log(`\nDone. Total: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(1)} MB (${totalSaved}%)`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
