// One-shot image optimizer for the testimonials folder.
// The data ships full-size PNGs but they render as 46px avatars; this
// writes a 96px (2x retina) WebP next to each PNG. Testimonials.astro
// prefers the .webp and falls back to the original on error.
// Run: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const dir = join(process.cwd(), 'public/assets/images/testimonials');

for (const file of await readdir(dir)) {
    if (!/\.png$/i.test(file)) continue;
    const out = file.replace(/\.png$/i, '.webp');
    const info = await sharp(join(dir, file))
        .resize(96, 96, { fit: 'cover' })
        .webp({ quality: 82 })
        .toFile(join(dir, out));
    console.log(`${file} -> ${out} (${info.size} bytes, ${info.width}x${info.height})`);
}
