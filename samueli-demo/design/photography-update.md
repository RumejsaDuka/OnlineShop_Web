> Historical site-wide photography update. The later homepage brief in `references/urban-home/brief.txt` explicitly approves the male-model urban campaign hero. Catalog, product, cart and search photography remain product-only.

# Samueli Fashion photography update

The existing local storefront now uses a shared set of 13 product-only studio assets: 12 catalog products and an editorial cap. Apparel uses complete ghost-mannequin front views; shoes and the cap use product-only photography. Each catalog gallery also has a detail crop from the same photograph. The sources are generated concepts derived from the existing demo assets, not verified inventory photographs or claimed restorations of low-resolution originals.

Approved references are preserved in `references/`. They guide photography, charcoal editorial backgrounds and light catalog surfaces; they are never rendered as website backgrounds. Existing page grids, navigation, typography, spacing, GSAP timelines and local shopping state remain in place. The real About Us store photograph and both approved logo files match their original SHA-256 hashes.

The audit covered the 36 supplied shop JPEGs as well as the demo WebP pack. The shop JPEGs show different garment designs/brands from the existing catalog, so the catalog was kept intact and its corresponding demo assets were used as references. The unused human-model campaign source is preserved in `legacy/`, outside the public directory.

## Shared consumers

- `src/lib/photography.ts` owns the front-photo paths; `src/lib/data.ts` supplies them to every product view.
- Home hero, category shortcuts, Streetwear banner and collection cards use those same product assets.
- Category headers, offers, collection pages and mega-menu tiles use charcoal CSS backgrounds with separate transparent images.
- Product cards, hover details, galleries, related items, search, wishlist, cart drawer, cart page and checkout reuse the shared catalog images. Offer menu tiles use the actual discounted product image.
- Existing empty accessories inventory remains empty; no product records, prices, sizes or stock were added or changed.

## Assets and delivery

- Final delivery assets: `public/images/studio/` (26 WebP files, about 2 MB combined).
- Project-local generated originals: `studio-sources/`.
- Built-in image tool prompts: `photography-prompts.json`; original generated-file provenance: `photography-inputs.json`.
- Native dimensions and delivery sizes: `photography-inventory.json`.
- Encoding only trims transparent margins, scales down, pads consistently and crops details. It never enlarges source content. Smaller detail crops retain their native dimensions.
- `next/image` supplies responsive sources and negotiates AVIF/WebP. Full product photographs use contain fitting; editorial title bands may crop intentionally.

## Verification

`npm run build`, ESLint and TypeScript validation pass. `node scripts/verify-photography.mjs` verifies all 26 image files, preserved store/logo hashes and the absence of legacy product/promotion paths in source code.

`qa/report.json` records 28 routes at both 1440 × 1000 and 390 × 844: 56 route/viewport checks with no broken main-content images, horizontal overflow or JavaScript page errors. Individual full-page screenshots and desktop/mobile contact sheets are in `qa/`.

Desktop/mobile interaction checks cover gallery selection, size selection and cart persistence, wishlist removal, sorting, category filters, search thumbnails, navigation menus and the motion-enabled hero reveal. `qa/final-review.json` records the focused final-build review after the offer tile correction; separate interaction reports are stored beside it.

Browser loopback access was blocked in this environment. The successful review used an isolated headless browser and intercepted requests to serve the actual production build HTML, CSS, JavaScript, fonts and images from disk, with no external network access. This checks rendered layouts and client behavior; it does not measure deployed Core Web Vitals or exercise a live server image-optimization endpoint.

No production website, backend or database was accessed or deployed.
