import fs from "node:fs/promises";
import sharp from "sharp";

const { routes } = JSON.parse(await fs.readFile("design/qa/report.json", "utf8"));
for (const device of ["desktop", "mobile"]) {
  const list = routes.filter(r => r.device === device);
  const columns = device === "desktop" ? 4 : 7;
  const width = device === "desktop" ? 350 : 190;
  const height = device === "desktop" ? 330 : 580;
  const layers = [];
  for (const [i, row] of list.entries()) {
    const file = `design/qa/${row.screenshot}`;
    const meta = await sharp(file).metadata();
    const cropHeight = Math.min(meta.height, device === "desktop" ? 1250 : 1500);
    const input = await sharp(file).extract({ left: 0, top: 0, width: meta.width, height: cropHeight }).resize(width, height - 30, { fit: "contain", position: "top", background: "#ddd" }).toBuffer();
    const label = Buffer.from(`<svg width="${width}" height="30"><rect width="100%" height="100%" fill="white"/><text x="5" y="19" font-size="${device === "desktop" ? 12 : 9}">${row.route.replace(/&/g, "&amp;")}</text></svg>`);
    layers.push({ input, left: i % columns * width, top: Math.floor(i / columns) * height + 30 }, { input: label, left: i % columns * width, top: Math.floor(i / columns) * height });
  }
  await sharp({ create: { width: columns * width, height: Math.ceil(list.length / columns) * height, channels: 3, background: "#ddd" } }).composite(layers).jpeg({ quality: 85 }).toFile(`design/qa/${device}-review-sheet.jpg`);
}
