#!/usr/bin/env node
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public');

const svg = (size, padding = 0) =>
  Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#0a0a0a"/>
  <g transform="translate(${size * 0.18 + padding}, ${size * 0.34 + padding}) scale(${
    (size * 0.64 - padding * 2) / 64
  })">
    <path d="M0 12h12v40H0zM52 12h12v40H52zM12 26h40v12H12z" fill="#ffffff"/>
  </g>
</svg>
`);

async function build() {
  await sharp(svg(192)).resize(192, 192).png().toFile(path.join(OUT, 'icon-192.png'));
  await sharp(svg(512)).resize(512, 512).png().toFile(path.join(OUT, 'icon-512.png'));
  await sharp(svg(512, 80)).resize(512, 512).png().toFile(path.join(OUT, 'icon-512-maskable.png'));
  console.log('Icons written to', OUT);
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
