import fs from 'node:fs/promises';
import sharp from 'sharp';

const paths = (await fs.readdir('public/images', { recursive: true })).filter(p => /\.(webp|jpeg)$/.test(p));
const layers = await Promise.all(paths.map(async (p, i) => {
  const input = await sharp(`public/images/${p}`).resize(180, 150, { fit: 'contain', background: '#ddd' }).toBuffer();
  const label = Buffer.from(`<svg width="180" height="28"><rect width="180" height="28" fill="white"/><text x="5" y="17" font-size="12">${i}: ${p.split(/[\\/]/).pop().slice(0, 22)}</text></svg>`);
  return [{ input, left: i % 6 * 180, top: Math.floor(i / 6) * 178 }, { input: label, left: i % 6 * 180, top: Math.floor(i / 6) * 178 + 150 }];
}));
await sharp({ create: { width: 1080, height: Math.ceil(paths.length / 6) * 178, channels: 3, background: '#eee' } }).composite(layers.flat()).jpeg().toFile('asset-audit.jpg');
await fs.writeFile('asset-audit.json', JSON.stringify(await Promise.all(paths.map(async (p, i) => {
  const { width, height } = await sharp(`public/images/${p}`).metadata();
  return { id: i, path: p, width, height };
})), null, 2));
