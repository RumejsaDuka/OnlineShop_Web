import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Copies generated originals into the project, then makes delivery assets without upscaling.
// This step only trims transparent margins, resizes, crops details, and encodes WebP.
const inputs = JSON.parse(await fs.readFile("design/photography-inputs.json", "utf8"));
await fs.mkdir("design/studio-sources", { recursive: true });
await fs.mkdir("public/images/studio", { recursive: true });
const inventory = [];
for (const { name, generatedPath } of inputs) {
  const localSource = `design/studio-sources/${name}.png`;
  if (path.resolve(generatedPath) !== path.resolve(localSource)) {
    // Rebuilds use the committed source copy, even on a different machine.
    try { await fs.access(localSource); } catch { await fs.copyFile(generatedPath, localSource); }
  }
  const original = await sharp(localSource).metadata();
  if (!original.hasAlpha) throw new Error(`${name}: transparent source required`);
  const trimmed = await sharp(localSource).trim({ background: "#00000000", threshold: 10 }).png().toBuffer();
  const front = await sharp(trimmed).resize(1056, 1056, { fit: "inside", withoutEnlargement: true }).toBuffer();
  const frontMeta = await sharp(front).metadata();
  await sharp({ create: { width: 1200, height: 1200, channels: 4, background: "#00000000" } })
    .composite([{ input: front, gravity: "centre" }]).webp({ quality: 90, alphaQuality: 100 }).toFile(`public/images/studio/${name}.webp`);
  const detailSize = Math.floor(Math.min(frontMeta.width, frontMeta.height) * 0.65);
  const detail = await sharp(front).extract({ left: Math.floor((frontMeta.width - detailSize) / 2), top: Math.floor((frontMeta.height - detailSize) * 0.25), width: detailSize, height: detailSize }).toBuffer();
  await sharp(detail).webp({ quality: 90, alphaQuality: 100 }).toFile(`public/images/studio/${name}-detail.webp`);
  inventory.push({ name, source: localSource, originalWidth: original.width, originalHeight: original.height, front: `/images/studio/${name}.webp`, frontWidth: 1200, frontHeight: 1200, detailWidth: detailSize, detailHeight: detailSize, frontBytes: (await fs.stat(`public/images/studio/${name}.webp`)).size });
}
await fs.writeFile("design/photography-inventory.json", JSON.stringify(inventory, null, 2) + "\n");
console.log(`Prepared ${inventory.length} product-only assets and detail crops; no source upscaling.`);
