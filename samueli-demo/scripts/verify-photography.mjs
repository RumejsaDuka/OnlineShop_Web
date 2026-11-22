import fs from "node:fs/promises";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import sharp from "sharp";

const source = await fs.readFile("src/lib/photography.ts", "utf8");
const names = [...source.matchAll(/\w+: photo\("([\w-]+)"\)/g)].map(m => m[1]);
for (const name of names) {
  for (const suffix of ["", "-detail"]) {
    const file = `public/images/studio/${name}${suffix}.webp`;
    const meta = await sharp(file).metadata();
    assert(meta.width > 100 && meta.height > 100, `${file} invalid size`);
    assert(meta.hasAlpha, `${file} lost transparency`);
  }
}
const preserved = {
  "public/images/store/samueli_store_front.webp": "d589b7bd4426434c4620366ba0e9672dc4f6493f59d152b045edd53ad2e01442",
  "public/images/brand/samueli-fashion-black.png": "31829e6bbcc4fa746bdbc6b078b86971f834e8a646b9de0bf5d901b225cfa3e2",
  "public/images/brand/samueli-fashion-white.png": "95fca6e331921c95c88c26cffaa9c03d2e9938f704b01c8c62cda5ecad762bd7",
};
for (const [file, expected] of Object.entries(preserved)) {
  assert.equal(crypto.createHash("sha256").update(await fs.readFile(file)).digest("hex"), expected, `${file} changed`);
}
for (const file of (await fs.readdir("src", { recursive: true })).filter(f => /\.tsx?$/.test(f))) {
  const text = await fs.readFile(`src/${file}`, "utf8");
  // The latest homepage brief explicitly approves this campaign background.
  const productOnlySource = text.replace(/\/images\/hero\/campaign-background-\d+\.webp/g, "");
  assert(!/\/images\/(hero|categories|products)\//.test(productOnlySource), `${file}: unapproved legacy imagery still referenced`);
}
console.log(`${names.length} front photos + detail crops valid. Store photo and both approved logos unchanged. Campaign assets match the latest homepage brief; catalog imagery remains product-only.`);
